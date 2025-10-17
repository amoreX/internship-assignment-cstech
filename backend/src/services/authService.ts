import bcrypt from 'bcryptjs';
import { storage } from '../storage';
import { generateToken } from '../middleware/auth';

export const authService = {
  async login(body: any) {
    const { email, password } = body;
    if (!email || !password) return null;

    const user = await storage.getUserByEmail(email);
    if (!user) return null;

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return null;

    const token = generateToken(user.id);
    return { token, user: { id: user.id, email: user.email } };
  },
};
