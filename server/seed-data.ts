import bcrypt from 'bcryptjs';
import { storage } from './storage';

/**
 * Seeds the database with initial test data
 */
export async function seedDatabase() {
  // Check if admin already exists
  const existingAdmin = await storage.getUserByEmail('admin@example.com');
  
  if (!existingAdmin) {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await storage.createUser({
      email: 'admin@example.com',
      password: hashedPassword,
    });
    console.log('✅ Seeded admin user: admin@example.com / admin123');
  } else {
    console.log('ℹ️  Admin user already exists');
  }

  // Check if test agents exist
  const existingAgents = await storage.getAgents();
  
  if (existingAgents.length === 0) {
    // Create some test agents
    const testAgents = [
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '+1-555-0201',
        password: await bcrypt.hash('agent123', 10),
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        phone: '+1-555-0202',
        password: await bcrypt.hash('agent123', 10),
      },
      {
        name: 'Carol Davis',
        email: 'carol@example.com',
        phone: '+1-555-0203',
        password: await bcrypt.hash('agent123', 10),
      },
      {
        name: 'David Wilson',
        email: 'david@example.com',
        phone: '+1-555-0204',
        password: await bcrypt.hash('agent123', 10),
      },
      {
        name: 'Eve Martinez',
        email: 'eve@example.com',
        phone: '+1-555-0205',
        password: await bcrypt.hash('agent123', 10),
      },
    ];

    for (const agent of testAgents) {
      await storage.createAgent(agent);
    }
    console.log('✅ Seeded 5 test agents');
  } else {
    console.log(`ℹ️  ${existingAgents.length} agents already exist`);
  }
}
