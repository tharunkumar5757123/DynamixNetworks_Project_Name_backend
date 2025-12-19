const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http'); // Needed for Socket.io
const { Server } = require('socket.io');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.send("Quiz Backend Running Successfully 🚀");
});

// MongoDB connection
const connectDB = require('./db');
connectDB();

// API routes
const questionsRouter = require('./routes/questions');
app.use('/api/questions', questionsRouter);

// Grade endpoint
app.post('/api/grade', async (req, res) => {
  try {
    const { answers } = req.body;
    if (!Array.isArray(answers))
      return res.status(400).json({ error: 'Invalid payload' });

    const ids = answers.map(a => a.id);
    const Question = require('./models/Question');
    const docs = await Question.find({ _id: { $in: ids } }).lean();

    const score = answers.reduce((acc, cur) => {
      const q = docs.find(d => d._id.toString() === cur.id);
      if (q && q.answer === cur.answer) return acc + 1;
      return acc;
    }, 0);

    res.json({ score, total: answers.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Wrap app in HTTP server for Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow your frontend URL
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Example event
  socket.on('message', (data) => {
    console.log('Received:', data);
    socket.emit('message', `Server got: ${data}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
