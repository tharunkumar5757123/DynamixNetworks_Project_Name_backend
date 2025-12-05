// backend/controllers/questionsController.js
const Question = require('../models/Question');

// Shuffle array
function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

// GET /api/questions?category=&difficulty=&limit=
async function getQuestions(req, res) {
  try {
    const { category, difficulty, limit } = req.query;
    const filter = {};
    if (category && category !== 'Any') filter.category = category;
    if (difficulty && difficulty !== 'Any') filter.difficulty = difficulty;

    const docs = await Question.find(filter).lean();
    shuffle(docs);

    const take = limit ? parseInt(limit, 10) : 10;

    const selected = docs.slice(0, take).map(q => {
      const opts = q.options.slice();
      shuffle(opts);
      return {
        id: q._id,
        question: q.question,
        options: opts,
        category: q.category,
        difficulty: q.difficulty
      };
    });

    res.json({ questions: selected });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

// Admin: add question
async function addQuestion(req, res) {
  try {
    const { question, options, answer, category, difficulty } = req.body;
    if (!question || !options || !answer)
      return res.status(400).json({ error: 'Missing fields' });

    const q = new Question({ question, options, answer, category, difficulty });
    await q.save();
    res.json({ ok: true, question: q });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getQuestions, addQuestion };
