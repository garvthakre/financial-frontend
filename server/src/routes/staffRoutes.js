// server/src/routes/staffRoutes.js - FIXED
const express = require('express');
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Branch = require('../models/Branch');
const { protect, authorize } = require('../middleware/auth');
const dashboardService = require('../services/dashboardService');
const logger = require('../utils/logger');

const router = express.Router();

// Protect all staff routes
router.use(protect, authorize('staff'));

// @route   GET /api/staff/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const { branchId } = req.query;
    
    const dashboard = await dashboardService.getStaffDashboard(
      new mongoose.Types.ObjectId(req.user._id),
      branchId ? new mongoose.Types.ObjectId(branchId) : null
    );
    
    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    logger.error('Staff dashboard error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/staff/branches
router.get('/branches', async (req, res) => {
  try {
    const branches = await Branch.find({ 
      _id: { $in: req.user.branches },
      isActive: true
    }).populate('clientId', 'name phone');
    
    res.json({
      success: true,
      count: branches.length,
      data: branches
    });
  } catch (error) {
    logger.error('Get branches error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/staff/transactions
router.get('/transactions', async (req, res) => {
  try {
    const { page = 1, limit = 50, branchId, type } = req.query;

    console.log('Staff transactions query:', {
      staffId: req.user._id,
      branchId,
      type,
      page,
      limit
    });

    const query = { 
      staffId: req.user._id, 
      status: 'completed' 
    };
    
    if (branchId) {
      query.branchId = new mongoose.Types.ObjectId(branchId);
    }
    if (type) {
      query.type = type;
    }

    // First, let's check if there are any transactions at all
    const totalCount = await Transaction.countDocuments(query);
    console.log(`Found ${totalCount} transactions matching query`);

    // If using aggregatePaginate
    if (Transaction.aggregatePaginate) {
      const aggregate = Transaction.aggregate([
        { $match: query },
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: 'users',
            localField: 'clientId',
            foreignField: '_id',
            as: 'client'
          }
        },
        {
          $lookup: {
            from: 'branches',
            localField: 'branchId',
            foreignField: '_id',
            as: 'branch'
          }
        },
        {
          $addFields: {
            client: { $arrayElemAt: ['$client', 0] },
            branch: { $arrayElemAt: ['$branch', 0] }
          }
        },
        {
          $project: {
            type: 1,
            amount: 1,
            commission: 1,
            finalAmount: 1,
            remark: 1,
            utrId: 1,
            balanceBefore: 1,
            balanceAfter: 1,
            status: 1,
            createdAt: 1,
            'client.name': 1,
            'client.phone': 1,
            'branch.name': 1,
            'branch.code': 1
          }
        }
      ]);

      const options = {
        page: parseInt(page),
        limit: parseInt(limit)
      };

      const transactions = await Transaction.aggregatePaginate(aggregate, options);
      
      console.log('Paginated transactions result:', {
        totalDocs: transactions.totalDocs,
        docsReturned: transactions.docs?.length || 0
      });

      res.json({
        success: true,
        data: transactions
      });
    } else {
      // Fallback without pagination
      const transactions = await Transaction.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .populate('clientId', 'name phone')
        .populate('branchId', 'name code')
        .lean();

      console.log(`Returning ${transactions.length} transactions`);

      res.json({
        success: true,
        data: {
          docs: transactions,
          totalDocs: totalCount,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalCount / parseInt(limit))
        }
      });
    }
  } catch (error) {
    logger.error('Get transactions error:', error);
    console.error('Get transactions error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});
// Add this route to server/src/routes/staffRoutes.js

// // @route   DELETE /api/staff/transactions/:id
// // @desc    Delete own transaction (with balance reversal)
// router.delete('/transactions/:id', async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const transaction = await Transaction.findById(req.params.id).session(session);
    
//     if (!transaction) {
//       await session.abortTransaction();
//       return res.status(404).json({ success: false, message: 'Transaction not found' });
//     }

//     // Verify staff owns this transaction
//     if (transaction.staffId.toString() !== req.user._id.toString()) {
//       await session.abortTransaction();
//       return res.status(403).json({ 
//         success: false, 
//         message: 'You can only delete your own transactions' 
//       });
//     }

//     // Don't allow deleting old transactions (e.g., older than 24 hours)
//     const transactionAge = Date.now() - new Date(transaction.createdAt).getTime();
//     const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
//     if (transactionAge > maxAge) {
//       await session.abortTransaction();
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Cannot delete transactions older than 24 hours. Contact admin.' 
//       });
//     }

//     // Get staff member
//     const staff = await User.findById(req.user._id).session(session);

//     // Reverse the balance change
//     if (transaction.type === 'credit') {
//       staff.walletBalance -= transaction.finalAmount;
//     } else if (transaction.type === 'debit') {
//       staff.walletBalance += transaction.finalAmount;
//     }

//     await staff.save({ session });

//     // Delete the transaction
//     await Transaction.findByIdAndDelete(transaction._id).session(session);

//     await session.commitTransaction();

//     logger.info(`Transaction deleted: ${transaction._id} by staff ${req.user.phone}`);

//     res.json({
//       success: true,
//       message: 'Transaction deleted and balance reversed successfully',
//       data: {
//         newBalance: staff.walletBalance
//       }
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     logger.error('Delete transaction error:', error);
//     res.status(500).json({ success: false, message: error.message });
//   } finally {
//     session.endSession();
//   }
// });


module.exports = router;