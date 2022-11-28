import fs from 'fs'
import path from 'path'

const loadPeople = () => {
  let data
  try {
    data = JSON.parse(
      fs.readFileSync(path.join(process.cwd(), 'components', 'people.json'))
    )
  } catch (e) {
    data = []
  }
  return data
}

const getPeople = () => {
  return loadPeople()
}

export { getPeople }
