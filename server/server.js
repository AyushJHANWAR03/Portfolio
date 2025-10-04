import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;
let conversationsCollection;

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB Atlas!");

    db = client.db("portfolio");
    conversationsCollection = db.collection("conversations");

    console.log("📦 Database and collection ready!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Save conversation
app.post('/api/conversations', async (req, res) => {
  try {
    const { question, answer, timestamp, userAgent, location } = req.body;

    const conversation = {
      question,
      answer,
      timestamp: timestamp || new Date().toISOString(),
      userAgent: userAgent || req.headers['user-agent'],
      location: location || 'unknown',
      ip: req.ip,
      createdAt: new Date()
    };

    const result = await conversationsCollection.insertOne(conversation);

    res.status(201).json({
      success: true,
      message: 'Conversation saved successfully',
      id: result.insertedId
    });
  } catch (error) {
    console.error('Error saving conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save conversation',
      error: error.message
    });
  }
});

// Get all conversations
app.get('/api/conversations', async (req, res) => {
  try {
    const conversations = await conversationsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      success: true,
      count: conversations.length,
      conversations
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations',
      error: error.message
    });
  }
});

// Get conversation statistics
app.get('/api/conversations/stats', async (req, res) => {
  try {
    const total = await conversationsCollection.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCount = await conversationsCollection.countDocuments({
      createdAt: { $gte: today }
    });

    res.json({
      success: true,
      stats: {
        total,
        today: todayCount
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

// Delete all conversations (admin only)
app.delete('/api/conversations', async (req, res) => {
  try {
    const result = await conversationsCollection.deleteMany({});

    res.json({
      success: true,
      message: `Deleted ${result.deletedCount} conversations`
    });
  } catch (error) {
    console.error('Error deleting conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete conversations',
      error: error.message
    });
  }
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await client.close();
  process.exit(0);
});
