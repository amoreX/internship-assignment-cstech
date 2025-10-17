import bcrypt from 'bcryptjs';
import { storage } from './storage';

const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

const TEST_AGENTS = [
  { name: 'John Smith', email: 'john@example.com', password: 'agent123' },
  { name: 'Sarah Johnson', email: 'sarah@example.com', password: 'agent123' },
  { name: 'Michael Brown', email: 'michael@example.com', password: 'agent123' },
  { name: 'Emily Davis', email: 'emily@example.com', password: 'agent123' },
  { name: 'David Wilson', email: 'david@example.com', password: 'agent123' },
];

export async function seedDatabase() {
  try {
    // Check if admin exists
    const existingAdmin = await storage.getUserByEmail(ADMIN_EMAIL);
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await storage.createUser({
        email: ADMIN_EMAIL,
        password: hashedPassword,
      });
      console.log('✅ Seeded admin user:', ADMIN_EMAIL, '/', ADMIN_PASSWORD);
    }

    // Seed test agents if none exist
    const existingAgents = await storage.getAgents();
    if (existingAgents.length === 0) {
      for (const agent of TEST_AGENTS) {
        const hashedPassword = await bcrypt.hash(agent.password, 10);
        await storage.createAgent({
          ...agent,
          password: hashedPassword,
        });
      }
      console.log('✅ Seeded', TEST_AGENTS.length, 'test agents');
    }
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
}