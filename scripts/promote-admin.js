import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://root:example@localhost:27017/users?authSource=admin';

async function promote(username) {
  if (!username) {
    console.error('Uso: node scripts/promote-admin.js <username>');
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection.db;
    const usersColl = db.collection('users');

    const res = await usersColl.findOneAndUpdate(
      { username },
      { $set: { role: 'admin' } },
      { returnDocument: 'after' }
    );

    if (!res.value) {
      console.error(`Usuario con username="${username}" no encontrado.`);
      process.exit(2);
    }

    console.log('Usuario promovido a admin:');
    console.log(res.value);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    try { await mongoose.disconnect(); } catch (_) {}
    process.exit(3);
  }
}

promote(process.argv[2]);
