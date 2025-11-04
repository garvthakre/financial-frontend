const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 100,
      minPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    await createIndexes();
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

const createIndexes = async () => {
  try {
    const collections = mongoose.connection.collections;
    
    if (collections.transactions) {
      await collections.transactions.createIndex({ clientId: 1, createdAt: -1 });
      await collections.transactions.createIndex({ staffId: 1, createdAt: -1 });
      await collections.transactions.createIndex({ branchId: 1, createdAt: -1 });
      await collections.transactions.createIndex({ utrId: 1 });
      console.log('✅ Transaction indexes created');
    }
    
    if (collections.users) {
      await collections.users.createIndex({ email: 1 }, { unique: true });
      await collections.users.createIndex({ role: 1 });
      console.log('✅ User indexes created');
    }
    
    if (collections.branches) {
      await collections.branches.createIndex({ clientId: 1 });
      await collections.branches.createIndex({ code: 1 }, { unique: true });
      console.log('✅ Branch indexes created');
    }
  } catch (error) {
    console.log('Index creation skipped (collections may not exist yet)');
  }
};

module.exports = connectDB;