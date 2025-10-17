import { randomUUID } from 'crypto';
import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://nihal:nihalokok@production.uu11zyf.mongodb.net/';
const DB_NAME = process.env.MONGO_DB || 'internship';

let db: any;

async function connect() {
  if (!db) {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
  }
  return db;
}

function col(name: string) {
  if (!db) throw new Error('Database not connected');
  return db.collection(name);
}

// --- Interfaces ---
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
  notes?: string | null;
  agentId?: string | null;
  distributionId?: string | null;
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
    await connect();
    await col('users').createIndex({ email: 1 }, { unique: true });
    await col('agents').createIndex({ email: 1 }, { unique: true });
  },


  async getUserByEmail(email: string) {
    await connect();
    return await col('users').findOne({ email });
  },

  async createUser(data: Omit<User, 'id'>) {
    await connect();
    const user = { ...data, id: randomUUID() };
    await col('users').insertOne(user);
    return user;
  },


  async getAgents() {
    await connect();
    return await col('agents').find().toArray();
  },

  async getAgent(id: string) {
    await connect();
    return await col('agents').findOne({ id });
  },

  async createAgent(data: Omit<Agent, 'id' | 'createdAt'>) {
    await connect();
    const agent = { ...data, id: randomUUID(), createdAt: new Date() };
    await col('agents').insertOne(agent);
    return agent;
  },

  async deleteAgent(id: string) {
    await connect();
    await col('agents').deleteOne({ id });
    await col('listItems').deleteMany({ agentId: id });
  },


  async createListItems(items: Omit<ListItem, 'id' | 'createdAt'>[]) {
    await connect();
    const data = items.map(i => ({ ...i, id: randomUUID(), createdAt: new Date() }));
    if (data.length) await col('listItems').insertMany(data);
    return data;
  },

  async getListItemsByDistribution(distributionId: string) {
    await connect();
    return await col('listItems').find({ distributionId }).toArray();
  },

  async getListItemsByAgent(agentId: string) {
    await connect();
    return await col('listItems').find({ agentId }).toArray();
  },

  async deleteListItemsByAgent(agentId: string) {
    await connect();
    await col('listItems').deleteMany({ agentId });
  },

  // --- Distributions ---
  async createDistribution(data: Omit<Distribution, 'id' | 'createdAt'>) {
    await connect();
    const distribution = { ...data, id: randomUUID(), createdAt: new Date() };
    await col('distributions').insertOne(distribution);
    return distribution;
  },

  async getDistributions() {
    await connect();
    return await col('distributions').find().toArray();
  },
};

// Auto initialize
storage.init().catch(console.error);
