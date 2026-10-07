const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const postRoutes = require('./routes/postRoutes');
const runConsumer = require('../infrastructure/messaging/PostConsumer');

const app = express();
app.use(express.json());

mongoose.set('bufferCommands', false);

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Post Service API' });
});

app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'CONNECTED' : 'DISCONNECTED';
  res.status(200).json({ status: 'UP', database: dbStatus });
});

app.use('/api', (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      success: false, 
      error: 'Database is not connected yet. Retrying connection.' 
    });
  }
  next();
});

app.use('/api/posts', postRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/posts_db';

const connectWithRetry = async () => {
  console.log(`Connecting to MongoDB at: ${MONGO_URI}`);
  try {
    await mongoose.connect(MONGO_URI, {
      family: 4,
      directConnection: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log('Connected to MongoDB successfully.');

    runConsumer().catch(err => console.error('Kafka Consumer error:', err.message));
  } catch (err) {
    console.error('MongoDB connection failed. Retrying in 5 seconds:', err.message);
    setTimeout(connectWithRetry, 5000);
  }
};

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  connectWithRetry();
});