import bcrypt from 'bcryptjs';
import { storage } from '../storage';

export const agentService = {
  async getAgents() {
    const agents = await storage.getAgents();
    return agents.map(({ password, ...agent }) => agent);
  },

  async createAgent(data: any) {
    const agents = await storage.getAgents();
    const exists = agents.find(a => a.email === data.email);
    if (exists) throw new Error('Email already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newAgent = await storage.createAgent({ ...data, password: hashedPassword });
    const { password, ...safeAgent } = newAgent;
    return safeAgent;
  },

  async deleteAgent(id: string) {
    const agent = await storage.getAgent(id);
    if (!agent) return false;
    await storage.deleteAgent(id);
    return true;
  },
};
