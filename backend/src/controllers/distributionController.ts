import { Request, Response } from 'express';
import { distributionService } from '../services/distributionService';

export async function uploadFile(req: Request, res: Response) {
  try {
    const result = await distributionService.handleUpload(req.file);
    if (!result) return res.status(400).json({ message: 'Upload failed' });
    res.status(201).json(result);
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ message: error.message });
  }
}

export async function listDistributions(req: Request, res: Response) {
  try {
    const data = await distributionService.getDistributions();
    res.json(data);
  } catch (error: any) {
    console.error('Get distributions error:', error);
    res.status(500).json({ message: 'Failed to retrieve distributions' });
  }
}
