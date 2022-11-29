import questions from '../questions.json'

export function getRandomQuestion() {
  return questions[Math.floor(Math.random() * questions.length)]
}

export function getQuestion(id) {
  return questions.find((q) => q.questionId === id)
}
