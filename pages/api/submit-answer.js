import { getQuestion } from '../../lib/questions'
const { v4: uuidv4 } = require('uuid')
import Redis from 'ioredis'

const client = new Redis(process.env.REDIS_URL)

export default async function handler(req, res) {
  const questionId = req.body.questionId
  const guess1 = req.body.guess1.toLowerCase()
  const guess2 = req.body.guess2.toLowerCase()
  const guess3 = req.body.guess3.toLowerCase()
  const question = getQuestion(questionId)
  const answers = question.people.map((p) => p.toLowerCase())
  client.set(
    uuidv4(),
    JSON.stringify({ questionId, guess1, guess2, guess3, date: new Date() })
  )

  const correct =
    [...new Set([guess1, guess2, guess3])].filter((answer) =>
      answers.includes(answer)
    ).length == 3

  res.status(200).json({
    correct,
    answers: question.people,
  })
}
