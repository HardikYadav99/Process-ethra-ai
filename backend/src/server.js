import { prisma, connectDB } from './config/db.js';
import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js';
import taskRoutes from './routes/task.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { Prisma } from '@prisma/client';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'ACCESS_TOKEN_EXPIRY',
  'REFRESH_TOKEN_EXPIRY'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('ERROR: Missing required environment variables:');
  missingEnvVars.forEach(varName => {
    console.error(`  - ${varName}`);
  });
  console.error('\nPlease check your .env file and ensure all required variables are set.');
  console.error('See .env.example for reference.');
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware - helmet for security headers
app.use(helmet());

// CORS configuration - restrict to frontend domain
// CORS configuration - allowing both common dev ports
const corsOptions = {
  origin: [process.env.FRONTEND_URL, 'http://localhost:5174', 'http://localhost:5173'].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));


// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to authentication routes
app.use('/api/auth', authLimiter);

// Health check endpoint (before routes)

app.get('/health', async (req, res) => {
  const healthStatus = {
    status: 'ok', // This represents the Server itself
    database: 'unknown',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  };

  try {
    // 1. Try to "ping" the database
    await prisma.$queryRaw`SELECT 1`;
    healthStatus.database = 'connected';
    
    // If everything is perfect, send 200 OK
    res.status(200).json(healthStatus);
  } catch (error) {
    // 2. If DB fails, we don't kill the whole response
    // We update the status and send a 503 (Service Unavailable)
    healthStatus.status = 'error';
    healthStatus.database = 'disconnected';
    healthStatus.message = error.message;

    res.status(503).json(healthStatus);
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last middleware
app.use(errorHandler);

// Start server
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`CORS enabled for: ${corsOptions.origin}`);
  }) ;
 };
 start();

