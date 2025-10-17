import { 
  type User, 
  type InsertUser,
  type Agent,
  type InsertAgent,
  type ListItem,
  type InsertListItem,
  type Distribution,
  type InsertDistribution
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Agent operations
  getAgents(): Promise<Agent[]>;
  getAgent(id: string): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  deleteAgent(id: string): Promise<void>;

  // List item operations
  createListItems(items: InsertListItem[]): Promise<ListItem[]>;
  getListItemsByDistribution(distributionId: string): Promise<ListItem[]>;
  getListItemsByAgent(agentId: string): Promise<ListItem[]>;
  deleteListItemsByAgent(agentId: string): Promise<void>;

  // Distribution operations
  createDistribution(distribution: InsertDistribution): Promise<Distribution>;
  getDistributions(): Promise<Distribution[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private agents: Map<string, Agent>;
  private listItems: Map<string, ListItem>;
  private distributions: Map<string, Distribution>;

  constructor() {
    this.users = new Map();
    this.agents = new Map();
    this.listItems = new Map();
    this.distributions = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Agent operations
  async getAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async getAgent(id: string): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const id = randomUUID();
    const createdAt = new Date();
    const agent: Agent = { ...insertAgent, id, createdAt };
    this.agents.set(id, agent);
    return agent;
  }

  async deleteAgent(id: string): Promise<void> {
    this.agents.delete(id);
    await this.deleteListItemsByAgent(id);
  }

  // List item operations
  async createListItems(items: InsertListItem[]): Promise<ListItem[]> {
    const createdItems: ListItem[] = [];
    for (const item of items) {
      const id = randomUUID();
      const createdAt = new Date();
      const listItem: ListItem = { 
        ...item, 
        id, 
        createdAt,
        agentId: item.agentId ?? null,
        notes: item.notes ?? null,
        distributionId: item.distributionId ?? null,
      };
      this.listItems.set(id, listItem);
      createdItems.push(listItem);
    }
    return createdItems;
  }

  async getListItemsByDistribution(distributionId: string): Promise<ListItem[]> {
    return Array.from(this.listItems.values()).filter(
      (item) => item.distributionId === distributionId
    );
  }

  async getListItemsByAgent(agentId: string): Promise<ListItem[]> {
    return Array.from(this.listItems.values()).filter(
      (item) => item.agentId === agentId
    );
  }

  async deleteListItemsByAgent(agentId: string): Promise<void> {
    const itemsToDelete = Array.from(this.listItems.entries())
      .filter(([, item]) => item.agentId === agentId)
      .map(([id]) => id);
    
    itemsToDelete.forEach(id => this.listItems.delete(id));
  }

  // Distribution operations
  async createDistribution(insertDistribution: InsertDistribution): Promise<Distribution> {
    const id = randomUUID();
    const createdAt = new Date();
    const distribution: Distribution = { ...insertDistribution, id, createdAt };
    this.distributions.set(id, distribution);
    return distribution;
  }

  async getDistributions(): Promise<Distribution[]> {
    return Array.from(this.distributions.values());
  }
}

export const storage = new MemStorage();
