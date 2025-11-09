// server/src/services/dashboardService.js - FIXED FIELD NAMES
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

      console.log('Admin Dashboard - Match Stage:', JSON.stringify(matchStage));

      const summary = await Transaction.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalCredits: {  // Changed from totalCredit to totalCredits
              $sum: { $cond: [{ $eq: ['$type', 'credit'] }, '$finalAmount', 0] }
            },
            totalDebits: {  // Changed from totalDebit to totalDebits
              $sum: { $cond: [{ $eq: ['$type', 'debit'] }, '$finalAmount', 0] }
            },
            commission: { $sum: '$commission' },  // Changed from totalCommission
            transactionCount: { $sum: 1 }
          }
        }
      ]);

      const result = summary[0] || {
        totalCredits: 0,
        totalDebits: 0,
        commission: 0,
        transactionCount: 0
      };

      console.log('Admin Dashboard - Result:', JSON.stringify(result));
      return result;
    } catch (error) {
      logger.error('Admin dashboard error:', error);
      console.error('Admin dashboard error:', error);
      throw error;
    }
  }

  async getClientDashboard(clientId) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const clientObjectId = clientId instanceof mongoose.Types.ObjectId 
        ? clientId 
        : new mongoose.Types.ObjectId(clientId);

      const matchStage = {
        clientId: clientObjectId,
        createdAt: { $gte: today },
        status: 'completed'
      };

      console.log('Client Dashboard - Match Stage:', JSON.stringify(matchStage));

      const summary = await Transaction.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalCredits: {  // Changed from totalCredit
              $sum: { $cond: [{ $eq: ['$type', 'credit'] }, '$finalAmount', 0] }
            },
            totalDebits: {  // Changed from totalDebit
              $sum: { $cond: [{ $eq: ['$type', 'debit'] }, '$finalAmount', 0] }
            },
            commission: { $sum: '$commission' },  // Changed from totalCommission
            transactionCount: { $sum: 1 }
          }
        }
      ]);

      const result = summary[0] || {
        totalCredits: 0,
        totalDebits: 0,
        commission: 0,
        transactionCount: 0
      };

      console.log('Client Dashboard - Result:', JSON.stringify(result));
      return result;
    } catch (error) {
      logger.error('Client dashboard error:', error);
      console.error('Client dashboard error:', error);
      throw error;
    }
  }

  async getStaffDashboard(staffId, branchId = null) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

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

      console.log('Staff Dashboard - Match Stage:', JSON.stringify(matchStage));

      const summary = await Transaction.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: null,
            totalCredits: {  // Changed from totalCredit
              $sum: { $cond: [{ $eq: ['$type', 'credit'] }, '$finalAmount', 0] }
            },
            totalDebits: {  // Changed from totalDebit
              $sum: { $cond: [{ $eq: ['$type', 'debit'] }, '$finalAmount', 0] }
            },
            commission: { $sum: '$commission' },  // Changed from totalCommission
            transactionCount: { $sum: 1 }
          }
        }
      ]);

      const result = summary[0] || {
        totalCredits: 0,
        totalDebits: 0,
        commission: 0,
        transactionCount: 0
      };

      console.log('Staff Dashboard - Result:', JSON.stringify(result));
      return result;
    } catch (error) {
      logger.error('Staff dashboard error:', error);
      console.error('Staff dashboard error:', error);
      throw error;
    }
  }
}

module.exports = new DashboardService();