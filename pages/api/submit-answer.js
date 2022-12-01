import { getQuestion } from '../../lib/questions'
import axios from 'axios'

export default async function handler(req, res) {
  const questionId = req.body.questionId
  const guess1 = req.body.guess1.toLowerCase()
  const guess2 = req.body.guess2.toLowerCase()
  const guess3 = req.body.guess3.toLowerCase()
  const counter = parseInt(req.body.counter)
  const question = getQuestion(questionId)
  const answers = question.people.map((p) => p.toLowerCase())

  try {
    axios.post(
      'https://analytics.prod.appadem.in/whoamai/guess/data',
      {
        questionId,
        guess1,
        guess2,
        guess3,
        date: new Date(),
        counter,
      },
      {
        headers: {
          'x-api-key': process.env.ANALYTICS_API_KEY,
        },
      }
    )
  } catch (e) {}

  const correct =
    [...new Set([guess1, guess2, guess3])].filter((answer) =>
      answers.includes(answer)
    ).length == 3

  res.status(200).json({
    correct,
    answers: question.people,
  })
}
