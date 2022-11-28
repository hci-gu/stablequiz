import fs from 'fs'
import path from 'path'

const loadQuestions = () => {
  let data
  try {
    data = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'questions.json')))
  } catch (e) {
    data = []
  }
  return data
}

const saveQuestions = (questions) => {
  fs.writeFileSync(path.join(process.cwd(), 'questions.json'), JSON.stringify(questions))
}

const addQuestion = (question) => {
  const questions = loadQuestions()
  questions.push(question)
  saveQuestions(questions)
}

const getQuestion = (questionId) => {
  const questions = loadQuestions()
  return questions.find(q => q.questionId === questionId)
}

const getQuestions = () => {
  return loadQuestions()
}

const getNewQuestionId = () => {
  return loadQuestions().length
}

export {
  addQuestion,
  getQuestion,
  getNewQuestionId,
  getQuestions,
}
