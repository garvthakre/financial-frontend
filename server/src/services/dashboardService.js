const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const logger = require('../utils/logger');

class DashboardService {
  async getAdminDashboard(filters = {}) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const matchStage = {
        createdAt: { $gte: today },
        status: 'completed',
        ...filters
      };

      const summary = await Transaction.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalCredit: {
              $sum: { $cond: [{ $eq: ['$type', 'credit'] }, '$finalAmount', 0] }
            },
            totalDebit: {
              $sum: { $cond: [{ $eq: ['$type', 'debit'] }, '$finalAmount', 0] }
            },
            totalCommission: { $sum: '$commission' },
            transactionCount: { $sum: 1 }
          }
        }
      ]);

      return summary[0] || {
        totalCredit: 0,
        totalDebit: 0,
        totalCommission: 0,
        transactionCount: 0
      };
    } catch (error) {
      logger.error('Admin dashboard error:', error);
      throw error;
    }
  }

  async getClientDashboard(clientId) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const summary = await Transaction.aggregate([
        {
          $match: {
            clientId: mongoose.Types.ObjectId(clientId),
            createdAt: { $gte: today },
            status: 'completed'
          }
        },
        {
          $group: {
            _id: null,
            totalCredit: {
              $sum: { $cond: [{ $eq: ['$type', 'credit'] }, '$finalAmount', 0] }
            },
            totalDebit: {
              $sum: { $cond: [{ $eq: ['$type', 'debit'] }, '$finalAmount', 0] }
            },
            totalCommission: { $sum: '$commission' },
            transactionCount: { $sum: 1 }
          }
        }
      ]);

      return summary[0] || {
        totalCredit: 0,
        totalDebit: 0,
        totalCommission: 0,
        transactionCount: 0
      };
    } catch (error) {
      logger.error('Client dashboard error:', error);
      throw error;
    }
  }

  async getStaffDashboard(staffId, branchId = null) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const matchStage = {
        staffId: mongoose.Types.ObjectId(staffId),
        createdAt: { $gte: today },
        status: 'completed'
      };

      if (branchId) {
        matchStage.branchId = mongoose.Types.ObjectId(branchId);
      }

      const summary = await Transaction.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalCredit: {
              $sum: { $cond: [{ $eq: ['$type', 'credit'] }, '$finalAmount', 0] }
            },
            totalDebit: {
              $sum: { $cond: [{ $eq: ['$type', 'debit'] }, '$finalAmount', 0] }
            },
            totalCommission: { $sum: '$commission' },
            transactionCount: { $sum: 1 }
          }
        }
      ]);

      return summary[0] || {
        totalCredit: 0,
        totalDebit: 0,
        totalCommission: 0,
        transactionCount: 0
      };
    } catch (error) {
      logger.error('Staff dashboard error:', error);
      throw error;
    }
  }
}

module.exports = new DashboardService();