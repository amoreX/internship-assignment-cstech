import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { MongoClient } from 'mongodb';

const DEFAULT_URI = 'mongodb+srv://nihal:nihalokok@production.uu11zyf.mongodb.net/';
const MONGO_URI = process.env.MONGO_URI || DEFAULT_URI;
const DB_NAME = process.env.MONGO_DB || 'internship';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export async function injectAdmin() {
  let client: MongoClient | null = null;

  try {
    console.log('🔌 Connecting to MongoDB...');
    client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const usersCol = db.collection('users');

    // Ensure email index
    await usersCol.createIndex({ email: 1 }, { unique: true });

    // Check if admin exists
    const existingAdmin = await usersCol.findOne({ email: ADMIN_EMAIL });
    if (existingAdmin) {
      console.log(`✅ Admin already exists with email: ${ADMIN_EMAIL}`);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Create admin user
    const adminUser = {
      id: randomUUID(),
      email: ADMIN_EMAIL,
      password: hashedPassword,
      createdAt: new Date(),
    };

    await usersCol.insertOne(adminUser);
    console.log(`🎉 Default admin user created successfully!`);
    console.log(`📧 Email: ${ADMIN_EMAIL}`);
    console.log(`🔑 Password: ${ADMIN_PASSWORD}`);
  } catch (error) {
    console.error('❌ Failed to inject admin:', error);
  } finally {
    if (client) await client.close();
  }
}

