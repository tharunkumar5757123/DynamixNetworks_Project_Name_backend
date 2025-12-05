// Run: npm run seed
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Question = require('../models/Question')


dotenv.config()


const data = [
{ question: 'Which HTML tag is used to include JavaScript?', options: ['<script>','<js>','<javascript>','<link>'], answer: '<script>', category: 'Web Dev', difficulty: 'Easy' },
{ question: 'What is 8 * 7?', options: ['54','56','48','64'], answer: '56', category: 'Math', difficulty: 'Easy' },
{ question: 'Who invented the World Wide Web?', options: ['Tim Berners-Lee','Linus Torvalds','Bill Gates','Steve Jobs'], answer: 'Tim Berners-Lee', category: 'GK', difficulty: 'Medium' },
// Add more questions here (recommended 50+)
]


async function run(){
await mongoose.connect(process.env.MONGO_URI)
console.log('Connected, seeding...')
await Question.deleteMany({})
await Question.insertMany(data)
console.log('Seeded', data.length)
process.exit(0)
}


run().catch(err=>{ console.error(err); process.exit(1) })