// server/src/routes/adminRoutes.js - FIXED VERSION
const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Branch = require('../models/Branch');
const Settings = require('../models/Settings');
const Transaction = require('../models/Transaction');
const { protect, authorize } = require('../middleware/auth');
const dashboardService = require('../services/dashboardService');
const { createAuditLog } = require('../utils/auditLog');
const logger = require('../utils/logger');

const router = express.Router();

// Protect all admin routes
router.use(protect, authorize('admin'));

// @route   POST /api/admin/clients
// @desc    Create new client
// @access  Admin only
router.post('/clients', [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('walletBalance').optional().isFloat({ min: 0 }).withMessage('Wallet balance must be positive')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: errors.array()[0].msg,
        errors: errors.array() 
      });
    }

    const { name, phone, password, walletBalance } = req.body;

    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Phone number already in use' });
    }

    const client = await User.create({
      name,
      phone,
      password,
      role: 'client',
      walletBalance: walletBalance || 50000,
      createdBy: req.user._id
    });

    await createAuditLog(req.user._id, 'create_client', 'user', client._id, 
      { name, phone, walletBalance: client.walletBalance }, req);

    logger.info(`Client created: ${client.phone} by admin ${req.user.phone}`);

    const clientData = await User.findById(client._id).select('-password');

    res.status(201).json({
      success: true,
      message: 'Client created successfully',
      data: clientData
    });
  } catch (error) {
    logger.error('Create client error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/admin/branches
// @desc    Create new branch
// @access  Admin only
router.post('/branches', [
  body('name').notEmpty().trim().withMessage('Branch name is required'),
  body('code').notEmpty().trim().withMessage('Branch code is required'),
  body('clientId').isMongoId().withMessage('Valid client ID is required'),
  body('address').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: errors.array()[0].msg,
        errors: errors.array() 
      });
    }

    const { name, code, clientId, address } = req.body;

    const existingBranch = await Branch.findOne({ code: code.toUpperCase() });
    if (existingBranch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Branch code already exists' 
      });
    }

    const client = await User.findById(clientId);
    if (!client || client.role !== 'client') {
      return res.status(400).json({ success: false, message: 'Invalid client ID' });
    }

    const branch = await Branch.create({
      name,
      code: code.toUpperCase(),
      clientId,
      address: address || '',
      createdBy: req.user._id
    });

    const populatedBranch = await Branch.findById(branch._id)
      .populate('clientId', 'name phone')
      .populate('staffMembers', 'name phone');

    await createAuditLog(req.user._id, 'create_branch', 'branch', branch._id, 
      { name, code, clientId }, req);

    logger.info(`Branch created: ${branch.code} by admin ${req.user.phone}`);

    res.status(201).json({
      success: true,
      message: 'Branch created successfully',
      data: populatedBranch
    });
  } catch (error) {
    logger.error('Create branch error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Branch code already exists' 
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/admin/staff
// @desc    Create new staff member
// @access  Admin only
router.post('/staff', [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('phone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('branches').isArray().withMessage('Branches must be an array'),
  body('clientId').isMongoId().withMessage('Valid client ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: errors.array()[0].msg,
        errors: errors.array() 
      });
    }

    const { name, phone, password, branches, clientId } = req.body;

    const userExists = await User.findOne({ phone });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Phone number already in use' });
    }

    const client = await User.findById(clientId);
    if (!client || client.role !== 'client') {
      return res.status(400).json({ success: false, message: 'Invalid client ID' });
    }

    if (branches && branches.length > 0) {
      const branchCount = await Branch.countDocuments({ _id: { $in: branches } });
      if (branchCount !== branches.length) {
        return res.status(400).json({ success: false, message: 'One or more invalid branch IDs' });
      }
    }

    const staff = await User.create({
      name,
      phone,
      password,
      role: 'staff',
      branches: branches || [],
      clientId,
      createdBy: req.user._id
    });

    if (branches && branches.length > 0) {
      await Branch.updateMany(
        { _id: { $in: branches } },
        { $addToSet: { staffMembers: staff._id } }
      );
    }

    const populatedStaff = await User.findById(staff._id)
      .select('-password')
      .populate('branches', 'name code')
      .populate('clientId', 'name phone');

    await createAuditLog(req.user._id, 'create_staff', 'user', staff._id, 
      { name, phone, branches }, req);

    logger.info(`Staff created: ${staff.phone} by admin ${req.user.phone}`);

    res.status(201).json({
      success: true,
      message: 'Staff member created successfully',
      data: populatedStaff
    });
  } catch (error) {
    logger.error('Create staff error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const { clientId, branchId } = req.query;
    
    const filters = {};
    // FIX: Use new keyword with ObjectId
    if (clientId && mongoose.Types.ObjectId.isValid(clientId)) {
      filters.clientId = new mongoose.Types.ObjectId(clientId);
    }
    if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
      filters.branchId = new mongoose.Types.ObjectId(branchId);
    }

    const dashboard = await dashboardService.getAdminDashboard(filters);
    
    res.json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    logger.error('Admin dashboard error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/clients
router.get('/clients', async (req, res) => {
  try {
    const clients = await User.find({ role: 'client' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: clients.length,
      data: clients
    });
  } catch (error) {
    logger.error('Get clients error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/branches
router.get('/branches', async (req, res) => {
  try {
    const branches = await Branch.find()
      .populate('clientId', 'name phone')
      .populate('staffMembers', 'name phone')
      .sort({ createdAt: -1 });
    
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

// @route   GET /api/admin/staff
router.get('/staff', async (req, res) => {
  try {
    const staff = await User.find({ role: 'staff' })
      .select('-password')
      .populate('branches', 'name code')
      .populate('clientId', 'name phone')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: staff.length,
      data: staff
    });
  } catch (error) {
    logger.error('Get staff error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/transactions
router.get('/transactions', async (req, res) => {
  try {
    const { page = 1, limit = 20, clientId, branchId, type, startDate, endDate } = req.query;

    const query = { status: 'completed' };
    
    // FIX: Use new keyword with ObjectId
    if (clientId && mongoose.Types.ObjectId.isValid(clientId)) {
      query.clientId = new mongoose.Types.ObjectId(clientId);
    }
    if (branchId && mongoose.Types.ObjectId.isValid(branchId)) {
      query.branchId = new mongoose.Types.ObjectId(branchId);
    }
    if (type) query.type = type;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

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
          from: 'users',
          localField: 'staffId',
          foreignField: '_id',
          as: 'staff'
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
          staff: { $arrayElemAt: ['$staff', 0] },
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
          'staff.name': 1,
          'staff.phone': 1,
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

// @route   PUT /api/admin/settings
router.put('/settings', [
  body('commissionRate').optional().isFloat({ min: 0, max: 100 }).withMessage('Commission rate must be between 0-100'),
  body('depositDeductionRate').optional().isFloat({ min: 0, max: 100 }).withMessage('Deposit deduction rate must be between 0-100')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { commissionRate, depositDeductionRate } = req.body;

    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create({
        commissionRate: commissionRate || 3,
        depositDeductionRate: depositDeductionRate || 3,
        updatedBy: req.user._id
      });
    } else {
      if (commissionRate !== undefined) settings.commissionRate = commissionRate;
      if (depositDeductionRate !== undefined) settings.depositDeductionRate = depositDeductionRate;
      settings.updatedBy = req.user._id;
      await settings.save();
    }

    await createAuditLog(req.user._id, 'update_settings', 'settings', settings._id, 
      { commissionRate, depositDeductionRate }, req);

    logger.info(`Settings updated by admin ${req.user.phone}`);

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    logger.error('Update settings error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/admin/settings
router.get('/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    
    if (!settings) {
      settings = await Settings.create({
        commissionRate: 3,
        depositDeductionRate: 3
      });
    }

    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    logger.error('Get settings error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PUT /api/admin/users/:id/status
router.put('/users/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = isActive;
    await user.save();

    await createAuditLog(req.user._id, 'update_user_status', 'user', user._id, 
      { isActive }, req);

    logger.info(`User ${user.phone} status updated to ${isActive} by admin ${req.user.phone}`);

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });
  } catch (error) {
    logger.error('Update user status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;