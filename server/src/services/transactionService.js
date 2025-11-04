const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Branch = require('../models/Branch');
const Settings = require('../models/Settings');
const { createAuditLog } = require('../utils/auditLog');
const logger = require('../utils/logger');

class TransactionService {
  async processTransaction(data, req) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { clientId, staffId, branchId, type, amount, remark, utrId } = data;

      // Validate client
      const client = await User.findById(clientId).session(session);
      if (!client || client.role !== 'client') {
        throw new Error('Invalid client');
      }

      // Validate branch
      const branch = await Branch.findById(branchId).session(session);
      if (!branch || !branch.isActive) {
        throw new Error('Invalid or inactive branch');
      }

      // Validate staff has access to branch
      const staff = await User.findById(staffId).session(session);
      if (!staff || !staff.branches.some(b => b.toString() === branchId.toString())) {
        throw new Error('Staff does not have access to this branch');
      }

      // Get settings
      let settings = await Settings.findOne().session(session);
      if (!settings) {
        settings = await Settings.create([{}], { session });
        settings = settings[0];
      }

      const commissionRate = settings.commissionRate || 3;
      const depositDeductionRate = settings.depositDeductionRate || 3;

      let finalAmount, commission;
      const balanceBefore = client.walletBalance;
      let balanceAfter;

      if (type === 'credit') {
        // Credit: Amount - 3% deduction
        commission = (amount * depositDeductionRate) / 100;
        finalAmount = amount - commission;
        balanceAfter = balanceBefore + finalAmount;
      } else if (type === 'debit') {
        // Debit: Amount + 3% commission
        commission = (amount * commissionRate) / 100;
        finalAmount = amount + commission;
        
        if (balanceBefore < finalAmount) {
          throw new Error(`Insufficient balance. Available: ₹${balanceBefore}, Required: ₹${finalAmount}`);
        }
        
        balanceAfter = balanceBefore - finalAmount;
      } else {
        throw new Error('Invalid transaction type');
      }

      // Update client wallet
      client.walletBalance = balanceAfter;
      await client.save({ session });

      // Create transaction record
      const transaction = await Transaction.create([{
        clientId,
        staffId,
        branchId,
        type,
        amount,
        commission,
        finalAmount,
        remark: remark || '',
        utrId,
        balanceBefore,
        balanceAfter,
        status: 'completed'
      }], { session });

      await session.commitTransaction();

      // Create audit log
      await createAuditLog(
        staffId,
        `transaction_${type}`,
        'transaction',
        transaction[0]._id,
        { amount, finalAmount, commission, balanceAfter },
        req
      );

      logger.info(`Transaction ${type} completed: ${transaction[0]._id}`);

      return transaction[0];
    } catch (error) {
      await session.abortTransaction();
      logger.error('Transaction failed:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getTransactionById(transactionId) {
    return await Transaction.findById(transactionId)
      .populate('clientId', 'name email')
      .populate('staffId', 'name email')
      .populate('branchId', 'name code');
  }
}

module.exports = new TransactionService();