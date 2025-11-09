// server/src/services/dashboardService.js - FIXED VERSION
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

      // FIX: Ensure clientId is already an ObjectId or create new one
      const clientObjectId = clientId instanceof mongoose.Types.ObjectId 
        ? clientId 
        : new mongoose.Types.ObjectId(clientId);

      const summary = await Transaction.aggregate([
        {
          $match: {
            clientId: clientObjectId,
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

      // FIX: Ensure IDs are ObjectId instances
      const staffObjectId = staffId instanceof mongoose.Types.ObjectId 
        ? staffId 
        : new mongoose.Types.ObjectId(staffId);

      const matchStage = {
        staffId: staffObjectId,
        createdAt: { $gte: today },
        status: 'completed'
      };

      if (branchId) {
        const branchObjectId = branchId instanceof mongoose.Types.ObjectId 
          ? branchId 
          : new mongoose.Types.ObjectId(branchId);
        matchStage.branchId = branchObjectId;
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