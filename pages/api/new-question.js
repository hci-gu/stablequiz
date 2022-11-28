import { getQuestions } from '../../components/questions'

export default async function handler(req, res) {
  const questions = await getQuestions()
  const question = questions[Math.floor(Math.random() * questions.length)]
  res.status(200).json({
    questionId: question.questionId,
    image: question.image,
  })
}
