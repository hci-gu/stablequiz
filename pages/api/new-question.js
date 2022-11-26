import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { people } from '../../components/people'
import { addQuestion, getNewQuestionId } from '../../components/questions'

const imgPath = path.join(process.cwd(), 'public', 'images')

export default async function handler(req, res) {
  const id = getNewQuestionId()
  const person1 = people[Math.floor(Math.random() * people.length)]
  const person2 = people[Math.floor(Math.random() * people.length)]
  const person3 = people[Math.floor(Math.random() * people.length)]
  const params = {
    questionId: id,
    people: [person1, person2, person3],
    prompts: [person1, person2, person3].map(p => `${p}, photograph, headshot, 4k`),
    weights: [0.333, 0.333, 0.333],
    seed: 5,
    steps: 50,
    cfg: 7.5,
  }
  addQuestion(params)

  const filename = `q${id}.png`

  return axios
    .post('http://leviathan.itit.gu.se:5000/combine', params, {
      responseType: 'stream',
    })
    .then((response) => {
      response.data.pipe(fs.createWriteStream(path.join(imgPath, filename)))
      response.data.on('end', () => {
        params.image = `/images/${filename}`
        res.status(200).json({
          questionId: id,
          image: params.image,
        })

        console.log({params})
      })
    })
}
