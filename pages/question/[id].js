import { Button, Center, Flex, Image, Select, Text } from '@mantine/core'
import { useState } from 'react'
import { getQuestion } from '../../components/questions'
import Confetti from 'react-confetti'
import { IconCheck } from '@tabler/icons'
import { useRouter } from 'next/router'
import { getPeople } from '../../components/people'

export async function getServerSideProps(context) {
  const { id } = context.params
  const question = await getQuestion(id)
  const people = await getPeople()

  if (!question) {
    return {
      redirect: {
        destination: '/',
      },
    }
  }

  return {
    props: {
      question,
      people,
    },
  }
}

const GuessInput = ({ people, guess, onChange }) => {
  console.log(guess.value)
  return (
    <Flex direction="column" gap="xs">
      <Select
        sx={{
          '> div > div > input': {
            border: guess.correct ? '1px solid #40C057' : '',
          },
        }}
        icon={guess.correct ? <IconCheck color="#40C057" /> : undefined}
        label="Person"
        placeholder="Name"
        searchable
        clearable
        onChange={onChange}
        value={guess.value}
        error={guess.correct === false}
        data={people.map((value) => ({ value, label: value }))}
      />
      <Text>
        {guess.answer && !guess.correct && (
          <>
            <strong>Correct:</strong> {guess.answer}
          </>
        )}
      </Text>
    </Flex>
  )
}

const initialState = () => [
  { value: null, correct: null },
  { value: null, correct: null },
  { value: null, correct: null },
]

export default function Question({ question, people = [] }) {
  const router = useRouter()
  const [guesses, setGuesses] = useState(initialState())

  const isCorrect = guesses.every((guess) => guess.correct)
  const isDone = guesses.every((guess) => guess.answer)

  const submit = async () => {
    const response = await fetch('/api/submit-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionId: question.questionId,
        guess1: guesses[0].value,
        guess2: guesses[1].value,
        guess3: guesses[2].value,
      }),
    })
    const data = await response.json()
    let answers = data.answers
    const update = guesses.map((guess) => {
      const correct = answers.includes(guess.value)

      return {
        ...guess,
        correct,
        answer: correct
          ? answers.splice(answers.indexOf(guess.value), 1)
          : undefined,
      }
    })

    setGuesses(
      update.map((guess) => ({
        ...guess,
        answer: guess.answer ? guess.answer : answers.shift(),
      }))
    )
  }

  const next = async () => {
    const response = await (await fetch('/api/new-question')).json()
    router.push(`/question/${response.questionId}`)
    setGuesses(initialState())
  }

  return (
    <Center>
      {isCorrect && <Confetti recycle={false} />}
      <Flex direction="column" gap="md" align="center">
        <Image src={question.image} width={512} height={512} radius="md" />
        <Flex gap="md">
          {guesses.map((guess, index) => (
            <GuessInput
              key={`GuessInput_${index}`}
              people={people}
              guess={guess}
              onChange={(value) => {
                guesses[index] = {
                  value,
                }
                setGuesses([...guesses])
              }}
            />
          ))}
        </Flex>
        {isDone ? (
          <Button onClick={next}>
            {isCorrect ? 'Next person' : 'New person'}
          </Button>
        ) : (
          <Button onClick={submit} disabled={!guesses.every((g) => g.value)}>
            Submit
          </Button>
        )}
      </Flex>
    </Center>
  )
}
