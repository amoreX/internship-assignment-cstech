#!/usr/bin/env tsx
import { storage } from '../src/storage';
import bcrypt from 'bcryptjs';

const EMAIL = 'admin@example.com';
const PLAIN = 'admin123';

async function main() {
  try {
    // ensure DB connection
    if ((storage as any).init) await (storage as any).init();

    const existing = await storage.getUserByEmail(EMAIL);
    if (existing) {
      console.log(`User ${EMAIL} already exists (id=${existing.id}).`);
      return;
    }

    const hashed = await bcrypt.hash(PLAIN, 10);
    const user = await storage.createUser({ email: EMAIL, password: hashed });
    console.log(`Created admin user ${EMAIL} with id ${user.id}`);
  } catch (err) {
    console.error('Failed to create admin user:', err);
    process.exitCode = 1;
  }
}

main();
