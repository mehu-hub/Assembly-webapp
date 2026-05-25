const mongoose = require('mongoose');
const dns = require('dns');

// Try to use Google DNS to bypass local Windows DNS SRV issues
dns.setServers(['8.8.8.8', '8.8.4.4']);

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in environment');
    process.exit(1);
  }
  
  try {
    console.log(`Attempting to connect to MongoDB...`);
    await mongoose.connect(uri, { family: 4 });
    console.log('✅ Successfully connected to MongoDB!');
    
    const admin = mongoose.connection.db.admin();
    const ping = await admin.ping();
    console.log('✅ Database ping successful:', ping);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
}

testConnection();
