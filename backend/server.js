require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Validate critical environment variables
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET is not defined in .env');
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error('❌ FATAL: MONGODB_URI is not defined in .env');
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json());

// logging in dev only
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server running' });
});

// routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found`, data: null });
});

app.use(errorHandler);

const net = require('net');

const startPort = parseInt(process.env.PORT, 10) || 5000;
let PORT = startPort;
let maxAttempts = 10;

// Function to check if a port is available
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => resolve(false));
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
};

// Function to find an available port
const findAvailablePort = async (startingPort, attempts = maxAttempts) => {
  for (let i = 0; i < attempts; i++) {
    const portToTry = startingPort + i;
    if (await isPortAvailable(portToTry)) {
      return portToTry;
    }
  }
  throw new Error(`Could not find available port after ${attempts} attempts starting from ${startingPort}`);
};

// Global error handlers for stability
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

connectDB().then(async () => {
  try {
    console.log('✓ Database connected successfully');
    
    // Find an available port
    PORT = await findAvailablePort(startPort);
    
    const server = app.listen(PORT, () => {
      console.log(`✓ Server started on port ${PORT}`);
      if (PORT !== startPort) {
        console.log(`  (Port ${startPort} was in use, using ${PORT} instead)`);
      }
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('✓ Ready to accept requests');
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}).catch((err) => {
  console.error('❌ Failed to connect to database:', err && err.message ? err.message : err);
  process.exit(1);
});

module.exports = app;
