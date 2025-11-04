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
// @desc    Get staff dashboard
// @access  Staff only
router.get('/dashboard', async (req, res) => {
  try {
    const { branchId } = req.query;
    
    const dashboard = await dashboardService.getStaffDashboard(
      mongoose.Types.ObjectId(req.user._id),
      branchId ? mongoose.Types.ObjectId(branchId) : null
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
// @desc    Get staff's assigned branches
// @access  Staff only
router.get('/branches', async (req, res) => {
  try {
    const branches = await Branch.find({ 
      _id: { $in: req.user.branches },
      isActive: true
    }).populate('clientId', 'name email');
    
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
// @desc    Get staff's transactions
// @access  Staff only
router.get('/transactions', async (req, res) => {
  try {
    const { page = 1, limit = 20, branchId, type } = req.query;

    const query = { staffId: req.user._id, status: 'completed' };
    
    if (branchId) query.branchId = branchId;
    if (type) query.type = type;

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
      { $unwind: '$client' },
      { $unwind: '$branch' },
      {
        $project: {
          type: 1,
          amount: 1,
          commission: 1,
          finalAmount: 1,
          remark: 1,
          utrId: 1,
          createdAt: 1,
          'client.name': 1,
          'client.email': 1,
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
    
    res.json({
      success: true,
      data: transactions
    });
  } catch (error) {
    logger.error('Get transactions error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;