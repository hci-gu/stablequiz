import { getRandomQuestion } from '../../lib/questions'

export default async function handler(req, res) {
  const question = getRandomQuestion()
  res.status(200).json({
    questionId: question.questionId,
  })
}
