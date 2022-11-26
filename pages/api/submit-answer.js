import { getQuestion } from '../../components/questions'

export default async function handler(req, res) {
  const questionId = req.body.questionId
  const guess1 = req.body.guess1.toLowerCase()
  const guess2 = req.body.guess2.toLowerCase()
  const guess3 = req.body.guess3.toLowerCase()
  const question = getQuestion(questionId)
  const answers = question.people.map(p => p.toLowerCase())
  const correct = [guess1, guess2, guess3].filter(answer => answers.includes(answer)).length == 3

  res.status(200).json({
    correct,
    answers: question.people,
  })
}
