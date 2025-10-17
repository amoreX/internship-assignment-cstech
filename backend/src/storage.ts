import { randomUUID } from 'crypto';
import { MongoClient, Db, Collection, Document } from 'mongodb';

const DEFAULT_URI = 'mongodb+srv://nihal:nihalokok@production.uu11zyf.mongodb.net/';
const MONGO_URI = process.env.MONGO_URI || DEFAULT_URI;
const DB_NAME = process.env.MONGO_DB || 'internship';

let client: MongoClient | null = null;
let db: Db | null = null;

async function connectIfNeeded() {
  if (db) return;
  client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(DB_NAME);
}

function col<T extends Document = Document>(name: string): Collection<T> {
  if (!db) throw new Error('Database not initialized');
  return db.collection<T>(name);
}

export interface User {
  id: string;
  email: string;
  password: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface ListItem {
  id: string;
  firstName: string;
  phone: string;
  notes: string | null;
  agentId: string | null;
  distributionId: string | null;
  createdAt: Date;
}

export interface Distribution {
  id: string;
  fileName: string;
  totalItems: number;
  createdAt: Date;
}

export const storage = {
  async init() {
    await connectIfNeeded();
    // Create unique indexes
    await col<User>('users').createIndex({ email: 1 }, { unique: true });
    await col<Agent>('agents').createIndex({ email: 1 }, { unique: true });
  },

  async getUserByEmail(email: string): Promise<User | undefined> {
    await connectIfNeeded();
    const doc = await col<any>('users').findOne({ email });
    return doc ? { ...doc } : undefined;
  },

  async createUser(data: Omit<User, 'id'>): Promise<User> {
    await connectIfNeeded();
    const id = randomUUID();
    const user = { ...data, id };
    await col('users').insertOne(user);
    return user;
  },

  async getAgents(): Promise<Agent[]> {
    await connectIfNeeded();
    return await col<Agent>('agents').find().toArray();
  },

  async getAgent(id: string): Promise<Agent | undefined> {
    await connectIfNeeded();
    return await col<Agent>('agents').findOne({ id }) || undefined;
  },

  async createAgent(data: Omit<Agent, 'id' | 'createdAt'>): Promise<Agent> {
    await connectIfNeeded();
    const id = randomUUID();
    const createdAt = new Date();
    const agent = { ...data, id, createdAt } as Agent;
    await col('agents').insertOne(agent);
    return agent;
  },

  async deleteAgent(id: string): Promise<void> {
    await connectIfNeeded();
    await col('agents').deleteOne({ id });
    await col('listItems').deleteMany({ agentId: id });
  },

  async createListItems(items: Omit<ListItem, 'id' | 'createdAt'>[]): Promise<ListItem[]> {
    await connectIfNeeded();
    const createdItems: ListItem[] = items.map(i => ({
      ...i,
      id: randomUUID(),
      createdAt: new Date(),
    } as ListItem));
    if (createdItems.length) await col('listItems').insertMany(createdItems as any[]);
    return createdItems;
  },

  async getListItemsByDistribution(distributionId: string): Promise<ListItem[]> {
    await connectIfNeeded();
    return await col<ListItem>('listItems').find({ distributionId }).toArray();
  },

  async getListItemsByAgent(agentId: string): Promise<ListItem[]> {
    await connectIfNeeded();
    return await col<ListItem>('listItems').find({ agentId }).toArray();
  },

  async deleteListItemsByAgent(agentId: string): Promise<void> {
    await connectIfNeeded();
    await col('listItems').deleteMany({ agentId });
  },

  async createDistribution(data: Omit<Distribution, 'id' | 'createdAt'>): Promise<Distribution> {
    await connectIfNeeded();
    const id = randomUUID();
    const createdAt = new Date();
    const distribution = { ...data, id, createdAt } as Distribution;
    await col('distributions').insertOne(distribution);
    return distribution;
  },

  async getDistributions(): Promise<Distribution[]> {
    await connectIfNeeded();
    return await col<Distribution>('distributions').find().toArray();
  },
};

// initialize connection
storage.init().catch(err => console.error('Failed to init storage:', err));