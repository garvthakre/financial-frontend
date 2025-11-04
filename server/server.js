require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/database');
const { connectRedis } = require('./src/config/redis');
const { initQueue, createTransactionWorker } = require('./src/config/queue');
const cronService = require('./src/services/cronService');
const transactionService = require('./src/services/transactionService');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 5000;

// Startup function
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Connect to Redis (optional)
    try {
      await connectRedis();
    } catch (err) {
      logger.warn('Redis connection failed, running without cache');
    }

    // Initialize queue (optional)
    try {
      await initQueue();
    } catch (err) {
      logger.warn('Queue initialization failed, using direct processing');
    }

    // Start cron jobs
    cronService.startDailyReset();

    // Start BullMQ worker for transactions (if queue is available)
    try {
      createTransactionWorker(async (job) => {
        try {
          await transactionService.processTransaction(job.data, { 
            ip: 'queue',
            get: () => 'BullMQ Worker'
          });
          logger.info(`Transaction processed from queue: ${job.id}`);
        } catch (error) {
          logger.error(`Transaction queue processing failed: ${job.id}`, error);
          throw error;
        }
      });
    } catch (err) {
      logger.warn('Worker creation skipped');
    }

    // Start server
    const server = app.listen(PORT, () => {
      console.log('');
      console.log('='.repeat(50));
      console.log('🚀 FINANCIAL MANAGEMENT SYSTEM STARTED');
      console.log('='.repeat(50));
      console.log(`📡 Server running on port: ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`⏰ Server time: ${new Date().toISOString()}`);
      console.log('='.repeat(50));
      console.log('');
      logger.info(`Server started successfully on port ${PORT}`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('❌ Unhandled Rejection:', err);
      console.error('Unhandled Rejection:', err);
      server.close(() => process.exit(1));
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      logger.error('❌ Uncaught Exception:', err);
      console.error('Uncaught Exception:', err);
      process.exit(1);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      logger.info('SIGTERM received, closing server gracefully');
      console.log('\n🛑 SIGTERM received, shutting down gracefully...');
      server.close(() => {
        logger.info('Server closed');
        console.log('✅ Server closed successfully');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      logger.info('SIGINT received, closing server gracefully');
      console.log('\n🛑 SIGINT received, shutting down gracefully...');
      server.close(() => {
        logger.info('Server closed');
        console.log('✅ Server closed successfully');
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error('Server startup failed:', error);
    console.error('❌ Server startup failed:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
