import { randomUUID } from "crypto";

// Type definitions
interface User {
  id: string;
  email: string;
  password: string;
}

interface Agent {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

interface ListItem {
  id: string;
  firstName: string;
  phone: string;
  notes: string | null;
  agentId: string | null;
  distributionId: string | null;
  createdAt: Date;
}

interface Distribution {
  id: string;
  fileName: string;
  totalItems: number;
  createdAt: Date;
}

// Storage class implementation
export class Storage {
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
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(data: Omit<User, 'id'>): Promise<User> {
    const id = randomUUID();
    const user = { ...data, id };
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

  async createAgent(data: Omit<Agent, 'id' | 'createdAt'>): Promise<Agent> {
    const id = randomUUID();
    const createdAt = new Date();
    const agent = { ...data, id, createdAt };
    this.agents.set(id, agent);
    return agent;
  }

  async deleteAgent(id: string): Promise<void> {
    this.agents.delete(id);
    await this.deleteListItemsByAgent(id);
  }

  // List item operations
  async createListItems(items: Omit<ListItem, 'id' | 'createdAt'>[]): Promise<ListItem[]> {
    const createdItems: ListItem[] = [];
    
    for (const item of items) {
      const id = randomUUID();
      const createdAt = new Date();
      const listItem = { ...item, id, createdAt };
      this.listItems.set(id, listItem);
      createdItems.push(listItem);
    }
    
    return createdItems;
  }

  async getListItemsByDistribution(distributionId: string): Promise<ListItem[]> {
    return Array.from(this.listItems.values())
      .filter(item => item.distributionId === distributionId);
  }

  async getListItemsByAgent(agentId: string): Promise<ListItem[]> {
    return Array.from(this.listItems.values())
      .filter(item => item.agentId === agentId);
  }

  async deleteListItemsByAgent(agentId: string): Promise<void> {
    const itemsToDelete = Array.from(this.listItems.entries())
      .filter(([, item]) => item.agentId === agentId)
      .map(([id]) => id);
    
    itemsToDelete.forEach(id => this.listItems.delete(id));
  }

  // Distribution operations
  async createDistribution(data: Omit<Distribution, 'id' | 'createdAt'>): Promise<Distribution> {
    const id = randomUUID();
    const createdAt = new Date();
    const distribution = { ...data, id, createdAt };
    this.distributions.set(id, distribution);
    return distribution;
  }

  async getDistributions(): Promise<Distribution[]> {
    return Array.from(this.distributions.values());
  }
}

export const storage = new Storage();