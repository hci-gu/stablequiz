import {
  Button,
  Center,
  Container,
  Flex,
  Image,
  Select,
  Text,
} from '@mantine/core'
import { useState } from 'react'
import Confetti from 'react-confetti'
import { IconCheck } from '@tabler/icons'
import { useRouter } from 'next/router'
import people from '../../people.json'
import { getQuestion } from '../../lib/questions'

export async function getServerSideProps(context) {
  const { id } = context.params
  const question = await getQuestion(id)

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
  return (
    <Flex direction="column">
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

  const submit = async (submittedGuesses) => {
    const response = await fetch('/api/submit-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionId: question.questionId,
        guess1: [0].value ?? '',
        guess2: [1].value ?? '',
        guess3: [2].value ?? '',
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
        <Image
          src={question.image}
          radius="md"
          sx={{
            width: '512px',
            height: 'auto',
            '@media (max-width: 755px)': {
              width: '100%',
              height: 'auto',
            },
          }}
        />
        <Flex
          gap="xs"
          direction={{
            base: 'column',
            sm: 'row',
          }}
        >
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
        {!isDone && (
          <Button onClick={submit} variant="outline">
            Give up
          </Button>
        )}
      </Flex>
    </Center>
  )
}
