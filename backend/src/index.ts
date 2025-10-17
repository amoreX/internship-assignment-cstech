import express from 'express';
import cors from 'cors';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { storage } from './storage';
import { authenticateToken, generateToken } from './middleware/auth';
import { parseCsvFile, distributeItems } from './utils/csv-parser';
import { seedDatabase } from './seed-data';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// File upload configuration
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Validation schemas
const userSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const agentSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

// Initialize database with seed data
seedDatabase();

// Auth Routes
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = userSchema.parse(req.body);

    const user = await storage.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user.id);
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(400).json({ message: error.message });
  }
});

// Agent Routes
app.get("/api/agents", authenticateToken, async (req, res) => {
  try {
    const agents = await storage.getAgents();
    const safeAgents = agents.map(({ password, ...agent }) => agent);
    res.json(safeAgents);
  } catch (error: any) {
    console.error("Get agents error:", error);
    res.status(500).json({ message: "Failed to retrieve agents" });
  }
});

app.post("/api/agents", authenticateToken, async (req, res) => {
  try {
    const agentData = agentSchema.parse(req.body);

    const agents = await storage.getAgents();
    const existingAgent = agents.find(a => a.email === agentData.email);
    if (existingAgent) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(agentData.password, 10);
    const newAgent = await storage.createAgent({
      ...agentData,
      password: hashedPassword,
    });

    const { password, ...safeAgent } = newAgent;
    res.status(201).json(safeAgent);
  } catch (error: any) {
    console.error("Create agent error:", error);
    res.status(400).json({ message: error.message });
  }
});

app.delete("/api/agents/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await storage.getAgent(id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    await storage.deleteAgent(id);
    res.json({ message: "Agent deleted successfully" });
  } catch (error: any) {
    console.error("Delete agent error:", error);
    res.status(500).json({ message: "Failed to delete agent" });
  }
});

// Distribution Routes
app.post(
  "/api/distributions/upload",
  authenticateToken,
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { originalname, buffer } = req.file;
      const { rows, errors } = parseCsvFile(buffer, originalname);

      if (errors.length > 0) {
        return res.status(400).json({ message: "CSV validation failed", errors });
      }

      if (rows.length === 0) {
        return res.status(400).json({ message: "No valid data found in CSV" });
      }

      const agents = await storage.getAgents();
      if (agents.length === 0) {
        return res.status(400).json({ 
          message: "No agents available. Please create agents before uploading." 
        });
      }

      const distribution = await storage.createDistribution({
        fileName: originalname,
        totalItems: rows.length,
      });

      const agentIds = agents.map(a => a.id);
      const distributedItems = distributeItems(rows, agentIds);

      const allListItems = [];
      for (const [agentId, items] of Array.from(distributedItems.entries())) {
        for (const item of items) {
          allListItems.push({
            firstName: item.FirstName,
            phone: item.Phone,
            notes: item.Notes || null,
            agentId,
            distributionId: distribution.id,
          });
        }
      }

      await storage.createListItems(allListItems);

      res.status(201).json({
        message: "File uploaded and distributed successfully",
        distributionId: distribution.id,
        totalItems: rows.length,
        agentsCount: agents.length,
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      res.status(500).json({ message: error.message });
    }
  }
);

app.get("/api/distributions", authenticateToken, async (req, res) => {
  try {
    const distributions = await storage.getDistributions();
    const agents = await storage.getAgents();

    const detailedDistributions = await Promise.all(
      distributions.map(async (dist) => {
        const items = await storage.getListItemsByDistribution(dist.id);

        const agentMap = new Map();
        agents.forEach(agent => {
          agentMap.set(agent.id, {
            id: agent.id,
            name: agent.name,
            email: agent.email,
            itemCount: 0,
            items: [],
          });
        });

        items.forEach(item => {
          if (item.agentId && agentMap.has(item.agentId)) {
            const agentData = agentMap.get(item.agentId);
            agentData.items.push({
              id: item.id,
              firstName: item.firstName,
              phone: item.phone,
              notes: item.notes || '',
            });
            agentData.itemCount++;
          }
        });

        return {
          ...dist,
          agents: Array.from(agentMap.values()),
        };
      })
    );

    detailedDistributions.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.json(detailedDistributions);
  } catch (error: any) {
    console.error("Get distributions error:", error);
    res.status(500).json({ message: "Failed to retrieve distributions" });
  }
});

const port = parseInt(process.env.PORT || '5000', 10);
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});