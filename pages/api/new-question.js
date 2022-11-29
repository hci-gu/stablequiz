import { NextResponse } from 'next/server'
import { getRandomQuestion } from '../../lib/questions'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(req, res) {
  const question = getRandomQuestion()
  return NextResponse.json({
    questionId: question.questionId,
  })
}
