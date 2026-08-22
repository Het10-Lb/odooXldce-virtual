require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./src/routes/authRoutes');
const dashboardRoutes = require('./src/routes/dashboardRoutes');
const destinationRoutes = require('./src/routes/destinationRoutes');
const tripRoutes = require('./src/routes/tripRoutes');
const communityRoutes = require('./src/routes/communityRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const templateRoutes = require('./src/routes/templateRoutes');

const { errorHandler, notFoundHandler } = require('./src/middleware/errorMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middlewares - Flexible CORS for development (allowing Vite dev server ports)
app.use(cors({
  origin: (origin, callback) => {
    // Allow any origin in development / local environment (e.g. localhost:5173, localhost:3000, 127.0.0.1, Postman, etc.)
    callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded files (Profile photos, trip covers, activity images, community media)
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

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
app.use('/api/community', communityRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/templates', templateRoutes);

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
    console.log(`   - Community: http://localhost:${PORT}/api/community`);
    console.log(`   - Templates: http://localhost:${PORT}/api/templates`);
    console.log(`   - Uploads: http://localhost:${PORT}/api/upload`);
    console.log(`   - Static Assets: http://localhost:${PORT}/uploads`);
    console.log(`=======================================================`);
  });
}

module.exports = app;
