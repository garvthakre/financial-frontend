// server/src/routes/transactionRoutes.js - ADD DELETE ROUTE
const express = require('express');
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const transactionService = require('../services/transactionService');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const mongoose = require('mongoose');
const logger = require('../utils/logger');

const router = express.Router();

// Protect all transaction routes
router.use(protect);

// @route   POST /api/transactions
// @desc    Create new transaction (staff only)
// @access  Staff only
router.post('/', authorize('staff'), [
  body('clientId').isMongoId().withMessage('Invalid client ID'),
  body('branchId').isMongoId().withMessage('Invalid branch ID'),
  body('type').isIn(['credit', 'debit']).withMessage('Type must be credit or debit'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('utrId').notEmpty().trim().withMessage('UTR ID is required'),
  body('remark').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { clientId, branchId, type, amount, remark, utrId } = req.body;

    // Verify staff has access to this branch
    const hasAccess = req.user.branches.some(b => b.toString() === branchId.toString());
    if (!hasAccess) {
      return res.status(403).json({ 
        success: false, 
        message: 'You do not have access to this branch' 
      });
    }

    // Process transaction
    const transaction = await transactionService.processTransaction({
      clientId,
      staffId: req.user._id,
      branchId,
      type,
      amount: parseFloat(amount),
      remark: remark || '',
      utrId
    }, req);

    logger.info(`Transaction created: ${transaction._id} by staff ${req.user.phone}`);

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    logger.error('Transaction creation error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete transaction (Admin or Staff who created it)
// @access  Admin or Staff (own transactions only)
router.delete('/:id', authorize('admin', 'staff'), async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const transaction = await Transaction.findById(req.params.id).session(session);
    
    if (!transaction) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Staff can only delete their own transactions
    if (req.user.role === 'staff' && transaction.staffId.toString() !== req.user._id.toString()) {
      await session.abortTransaction();
      return res.status(403).json({ 
        success: false, 
        message: 'You can only delete your own transactions' 
      });
    }

    // Don't allow deleting old transactions for staff (admin can delete any)
    if (req.user.role === 'staff') {
      const transactionAge = Date.now() - new Date(transaction.createdAt).getTime();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (transactionAge > maxAge) {
        await session.abortTransaction();
        return res.status(400).json({ 
          success: false, 
          message: 'Cannot delete transactions older than 24 hours. Contact admin.' 
        });
      }
    }

    // Get staff member
    const staff = await User.findById(transaction.staffId).session(session);
    if (!staff) {
      await session.abortTransaction();
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    // Reverse the balance change
    if (transaction.type === 'credit') {
      // Was: staff balance increased by finalAmount
      // Reverse: decrease staff balance
      staff.walletBalance -= transaction.finalAmount;
    } else if (transaction.type === 'debit') {
      // Was: staff balance decreased by finalAmount
      // Reverse: increase staff balance
      staff.walletBalance += transaction.finalAmount;
    }

    await staff.save({ session });

    // Delete the transaction
    await Transaction.findByIdAndDelete(transaction._id).session(session);

    await session.commitTransaction();

    logger.info(`Transaction deleted: ${transaction._id} by ${req.user.role} ${req.user.phone}`);

    res.json({
      success: true,
      message: 'Transaction deleted and balance reversed successfully',
      data: {
        newBalance: staff.walletBalance
      }
    });
  } catch (error) {
    await session.abortTransaction();
    logger.error('Delete transaction error:', error);
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
});

// @route   GET /api/transactions/:id
// @desc    Get transaction by ID
// @access  Staff, Client, Admin
router.get('/:id', async (req, res) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Check access rights
    if (req.user.role === 'staff' && transaction.staffId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    
    if (req.user.role === 'client' && transaction.clientId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({
      success: true,
      data: transaction
    });
  } catch (error) {
    logger.error('Get transaction error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;