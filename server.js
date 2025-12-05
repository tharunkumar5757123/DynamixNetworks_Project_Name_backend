const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = require('./db');
connectDB();

// Routes
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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
