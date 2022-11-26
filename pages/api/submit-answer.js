import { getQuestion } from '../../components/questions'

export default async function handler(req, res) {
  const questionId = req.body.questionId
  const guess1 = req.body.guess1
  const guess2 = req.body.guess2
  const guess3 = req.body.guess3
  const question = getQuestion(questionId)
  const answers = [guess1, guess2, guess3]
  const correct = answers.filter(answer => question.people.includes(answer)).length == 3

  res.status(200).json({
    correct,
    answers: question.people,
  })
}
