// read list of people from people.txt

const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const axios = require('axios')

const uploadImageToS3 = require('./lib/upload-to-s3')

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

const loadPeople = async () => {
  let people
  try {
    people = fs.readFileSync(path.join(process.cwd(), 'people.txt'), 'utf8').split('\n')

    // remove empty lines
    people = people.filter(p => p.length > 0)

    // remove duplicates
    people = [...new Set(people)]
  } catch (e) {
    console.error(e)
    process.exit(-1)
  }
  return people
}

// function that downloads an image from url and saves to a file
function downloadImage(url, params, filename) {
  return new Promise((resolve, reject) => {
    axios.post(url, params, { responseType: 'stream' }).then((response) => {
      response.data.pipe(fs.createWriteStream(filename))
      response.data.on('end', () => {
        resolve()
      })
    })
  })
}

const getRandomThreePeople = (people) => {
  const person1 = people[Math.floor(Math.random() * people.length)]
  const person2 = people[Math.floor(Math.random() * people.length)]
  const person3 = people[Math.floor(Math.random() * people.length)]
  let persons = [person1, person2, person3]

  // remove duplicates
  persons = [...new Set(persons)]

  if (persons.length === 3)
    return persons
  else
    return getRandomThreePeople(people)
}

const npeople = 1000
const imgPath = path.join(process.cwd(), 'tmp')

const main = async () => {
  const people = await loadPeople()
   
  // write people to components/people.json
  fs.writeFileSync(path.join(process.cwd(), 'people.json'), JSON.stringify(people))

  for (let i=0;i<npeople;i++) {
    console.log('Generating image', i)
    // generate a list of random three people
    const persons = getRandomThreePeople(people)

    // get uuid for this question
    const id = uuidv4()

    const params = {
      questionId: id,
      people: persons,
      prompts: persons.map(p => `${p}, photograph, headshot, 4k`),
      weights: [0.333, 0.333, 0.333],
      seed: 5,
      steps: 100,
      cfg: 7.5,
    }

    const filename = `q${id}.png`

    await downloadImage('http://leviathan.itit.gu.se:5000/combine', params, path.join(imgPath, filename))

    console.log('Downloaded image', filename, persons)

    // upload to aws
    const url = await uploadImageToS3(filename, fs.readFileSync(path.join(imgPath, filename)))
    params.image = url

    console.log('Uploaded image to AWS', url)

    // add to database
    addQuestion(params)
  }
}

main()
