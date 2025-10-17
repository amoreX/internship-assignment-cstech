import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth';
import agentRoutes from './routes/agents';
import distributionRoutes from './routes/distributions';
import { injectAdmin } from './utils/inject-admin';
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
injectAdmin();
// (File uploads, validation and business logic are handled in controllers/services)

// Database connection is initialized by storage (MongoDB)

// Mount refactored routers
app.use('/api/auth', authRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/distributions', distributionRoutes);

const port = parseInt(process.env.PORT || '5000', 10);
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});