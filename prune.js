// This will check names in people.txt and remove any questions that have those names

const fs = require('fs')
const path = require('path')

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

const main = async () => {
  const people = await loadPeople()
  const questions = await loadQuestions()

  const pruned = questions.filter(({ people: names }) => {
    return names.every(p => people.includes(p))
  })

  const removed = questions.filter(question => !pruned.includes(question))

  console.log('Sample of removed image combinations')
  removed.slice(0,10).forEach(({ people: names }) => {
    console.log(names)
  })
  console.log(questions.length, pruned.length)

  saveQuestions(pruned)
}

main()
