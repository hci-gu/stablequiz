require('dotenv').config()

const fs = require('fs')
const path = require('path')
const axios = require('axios')

const saveHints = (hints) => {
  fs.writeFileSync(path.join(process.cwd(), 'hints.json'), JSON.stringify(hints))
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

  const hints = {}

  for (let i = 0; i < people.length; i++) {
    const name = people[i]

    console.log(`${i} Getting hint for ${name}`)

    const url = 'https://api.openai.com/v1/completions'
    const params = {
      model: "text-davinci-003",
      prompt: `Tell me a surprising fact about ${name} without using their name.`,
      temperature: 0,
      max_tokens: 50
    }

    await axios.post(url, params, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY,
      }
    }).then((response) => {
      const data = response.data
      const text = data.choices[0].text.trim()
      console.log('  >> ' + text)
      hints[name] = text
    })
  }

  saveHints(hints)
}

main()
