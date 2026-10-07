const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const postRoutes = require('./routes/postRoutes');
const runConsumer = require('../infrastructure/messaging/Postconsumer');

const app = express();

app.use(express.json());

app.use('/api/posts', postRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', message: 'Server is running smoothly' });
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/posts_db';

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to mongodb successfully.');

    runConsumer().catch(err => console.error(' Kafka Consumer Warning:', err.message));

    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start application:', error.message);
    process.exit(1);
  }
};

startServer();