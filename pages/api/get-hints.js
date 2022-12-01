import { NextResponse } from 'next/server'
import { getQuestion } from '../../lib/questions'
import hints from '../../hints.json'
import { getQueryParamsFromUrl } from '../../lib/utils'

export const config = {
  runtime: 'experimental-edge',
}

export default async function handler(req, res) {
  const params = getQueryParamsFromUrl(req.url)
  const question = await getQuestion(params.id)

  const peopleHints = question.people.map(name => hints[name] || '')

  return NextResponse.json({
    hints: peopleHints,
  })
}
