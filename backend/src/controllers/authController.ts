import { Request, Response } from 'express';
import { authService } from '../services/authService';

export async function login(req: Request, res: Response) {
  try {
    const result = await authService.login(req.body);
    if (!result) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json(result);
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(400).json({ message: error.message });
  }
}
