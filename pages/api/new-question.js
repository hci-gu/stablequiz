import { NextResponse } from 'next/server'
import { getRandomQuestion } from '../../lib/questions'
import seedQuestions from '../../lib/seed-questions'
import { getCounterFromUrl } from '../../lib/utils'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(req, res) {
  const counter = getCounterFromUrl(req.url)

  let questionId = getRandomQuestion().questionId

  if (counter < seedQuestions.length && Math.random() < 0.5) {
    questionId = seedQuestions[counter % seedQuestions.length]
  }

  return NextResponse.json({
    questionId,
  })
}
