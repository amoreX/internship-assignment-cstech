import express from 'express';
import cors from 'cors';
// (Remaining logic moved to controllers/services)
import { storage } from './storage';
import { seedDatabase } from './seed-data';
import authRoutes from './routes/auth';
import agentRoutes from './routes/agents';
import distributionRoutes from './routes/distributions';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// (File uploads, validation and business logic are handled in controllers/services)

// Initialize database with seed data
seedDatabase();

// Mount refactored routers
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/distributions', distributionRoutes);

const port = parseInt(process.env.PORT || '5000', 10);
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});