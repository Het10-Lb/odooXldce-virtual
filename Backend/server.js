require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const destinationRoutes = require('./src/routes/destinationRoutes');
const tripRoutes = require('./src/routes/tripRoutes');
const { errorHandler, notFoundHandler } = require('./src/middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'GlobalTrotter Backend API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/trips', tripRoutes);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` GlobalTrotter API Service running on port ${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Endpoints mounted:`);
    console.log(`   - Auth: http://localhost:${PORT}/api/auth`);
    console.log(`   - Dashboard: http://localhost:${PORT}/api/dashboard`);
    console.log(`   - Destinations: http://localhost:${PORT}/api/destinations`);
    console.log(`   - Trips: http://localhost:${PORT}/api/trips`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
