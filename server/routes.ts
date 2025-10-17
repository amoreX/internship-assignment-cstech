import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authenticateToken, generateToken, type AuthRequest } from "./middleware/auth";
import { parseCsvFile, distributeItems } from "./utils/csv-parser";
import { seedDatabase } from "./seed-data";
import bcrypt from "bcryptjs";
import multer from "multer";
import { insertAgentSchema, insertUserSchema } from "@shared/schema";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Seed database with initial data
  await seedDatabase();

  // ============================================
  // Authentication Routes
  // ============================================

  /**
   * POST /api/auth/login
   * Admin login endpoint
   */
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = insertUserSchema.parse(req.body);

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
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });

  // ============================================
  // Agent Routes
  // ============================================

  /**
   * GET /api/agents
   * Get all agents
   */
  app.get("/api/agents", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const agents = await storage.getAgents();
      
      // Remove passwords from response
      const safeAgents = agents.map(({ password, ...agent }) => agent);
      
      res.json(safeAgents);
    } catch (error: any) {
      console.error("Get agents error:", error);
      res.status(500).json({ message: "Failed to retrieve agents" });
    }
  });

  /**
   * POST /api/agents
   * Create new agent
   */
  app.post("/api/agents", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const agentData = insertAgentSchema.parse(req.body);

      // Check if email already exists
      const agents = await storage.getAgents();
      const existingAgent = agents.find(a => a.email === agentData.email);
      if (existingAgent) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(agentData.password, 10);

      const newAgent = await storage.createAgent({
        ...agentData,
        password: hashedPassword,
      });

      // Remove password from response
      const { password, ...safeAgent } = newAgent;
      res.status(201).json(safeAgent);
    } catch (error: any) {
      console.error("Create agent error:", error);
      res.status(400).json({ message: error.message || "Failed to create agent" });
    }
  });

  /**
   * DELETE /api/agents/:id
   * Delete agent and their assigned lists
   */
  app.delete("/api/agents/:id", authenticateToken, async (req: AuthRequest, res) => {
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

  // ============================================
  // Distribution Routes
  // ============================================

  /**
   * POST /api/distributions/upload
   * Upload CSV file and distribute among agents
   */
  app.post(
    "/api/distributions/upload",
    authenticateToken,
    upload.single('file'),
    async (req: AuthRequest, res) => {
      try {
        if (!req.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        const { originalname, buffer } = req.file;

        // Parse CSV file
        const { rows, errors } = parseCsvFile(buffer, originalname);

        if (errors.length > 0) {
          return res.status(400).json({ 
            message: "CSV validation failed", 
            errors 
          });
        }

        if (rows.length === 0) {
          return res.status(400).json({ message: "No valid data found in CSV" });
        }

        // Get all agents
        const agents = await storage.getAgents();
        if (agents.length === 0) {
          return res.status(400).json({ 
            message: "No agents available. Please create agents before uploading." 
          });
        }

        // Create distribution record
        const distribution = await storage.createDistribution({
          fileName: originalname,
          totalItems: rows.length,
        });

        // Distribute items among agents
        const agentIds = agents.map(a => a.id);
        const distributedItems = distributeItems(rows, agentIds);

        // Create list items with agent assignments
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
        res.status(500).json({ 
          message: error.message || "Failed to upload and distribute file" 
        });
      }
    }
  );

  /**
   * GET /api/distributions
   * Get all distributions with their assigned items
   */
  app.get("/api/distributions", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const distributions = await storage.getDistributions();
      const agents = await storage.getAgents();

      // Build detailed distribution data
      const detailedDistributions = await Promise.all(
        distributions.map(async (dist) => {
          const items = await storage.getListItemsByDistribution(dist.id);

          // Group items by agent
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

      // Sort by creation date, newest first
      detailedDistributions.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      res.json(detailedDistributions);
    } catch (error: any) {
      console.error("Get distributions error:", error);
      res.status(500).json({ message: "Failed to retrieve distributions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
