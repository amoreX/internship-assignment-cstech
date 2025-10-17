import { Request, Response } from 'express';
import { agentService } from '../services/agentService';

export async function getAgents(req: Request, res: Response) {
  try {
    const agents = await agentService.getAgents();
    res.json(agents);
  } catch (error: any) {
    console.error('Get agents error:', error);
    res.status(500).json({ message: 'Failed to retrieve agents' });
  }
}

export async function createAgent(req: Request, res: Response) {
  try {
    const agent = await agentService.createAgent(req.body);
    res.status(201).json(agent);
  } catch (error: any) {
    console.error('Create agent error:', error);
    res.status(400).json({ message: error.message });
  }
}

export async function deleteAgent(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await agentService.deleteAgent(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    res.json({ message: 'Agent deleted successfully' });
  } catch (error: any) {
    console.error('Delete agent error:', error);
    res.status(500).json({ message: 'Failed to delete agent' });
  }
}
