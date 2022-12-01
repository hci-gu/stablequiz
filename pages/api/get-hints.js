import { NextResponse } from 'next/server'
import { getQuestion } from '../../lib/questions'
import hints from '../../hints.json'
import { getQueryParamsFromUrl } from '../../lib/utils'
import axios from 'axios'

export default async function handler(req, res) {
  const params = getQueryParamsFromUrl(req.url)
  const question = await getQuestion(params.id)

  const peopleHints = question.people.map((name) => hints[name] || '')

  try {
    await axios.post(
      'https://analytics.prod.appadem.in/whoamai/hints/data',
      {
        questionId: question.questionId,
        date: new Date(),
        hints: peopleHints,
      },
      {
        headers: {
          'x-api-key': process.env.ANALYTICS_API_KEY,
        },
      }
    )
  } catch (e) {
    console.log(e)
  }

  res.status(200).json({
    hints: peopleHints,
  })
}
