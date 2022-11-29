import {
  Anchor,
  Button,
  Center,
  Container,
  Flex,
  Image,
  MediaQuery,
  Select,
  Text,
  Title,
} from '@mantine/core'
import { useRef, useState } from 'react'
import Confetti from 'react-confetti'
import { IconCheck, IconClipboard } from '@tabler/icons'
import { useRouter } from 'next/router'
import people from '../../people.json'
import { getQuestion } from '../../lib/questions'
import Head from 'next/head'

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

const GuessInput = ({ people, label, guess, onChange }) => {
  return (
    <Flex direction="column">
      <Select
        sx={{
          '> div > div > input': {
            border: guess.correct ? '1px solid #40C057' : '',
          },
        }}
        icon={guess.correct ? <IconCheck color="#40C057" /> : undefined}
        label={label}
        placeholder="Name"
        searchable
        clearable
        onChange={onChange}
        value={guess.value}
        error={guess.correct === false}
        filter={(value, item) => {
          if (value.length < 3) return false
          return item.label.toLowerCase().includes(value.toLowerCase().trim())
        }}
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
  const clipboardButtonRef = useRef()
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
        guess1: guesses[0].value ?? '',
        guess2: guesses[1].value ?? '',
        guess3: guesses[2].value ?? '',
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
    <>
      <Head>
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Who am aI?" />
        <meta
          property="og:description"
          content="Guess which three people aI am."
        />
        <meta property="og:image" content={question.image} />
        <meta property="og:image:width" content={512} />
        <meta property="og:image:height" content={512} />
      </Head>
      <Center>
        {isCorrect && <Confetti recycle={false} />}
        <Flex direction="column" gap="md" align="center">
          <Center>
            <Anchor style={{ color: '#000' }} href="/">
              <Title order={1} size={32}>
                WHO AM <span style={{ fontSize: 16 }}>A</span>I?
              </Title>
            </Anchor>
          </Center>
          <Image
            src={question.image}
            radius="lg"
            sx={{
              width: '512px',
              height: 'auto',
              '@media (max-width: 1540px)': {
                width: '468px !important',
              },
              '@media (max-width: 768px)': {
                width: '100% !important',
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
                label={`Person ${index + 1}`}
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
          <Flex gap="xs">
            {!isDone && (
              <Button onClick={submit} variant="outline">
                Give up
              </Button>
            )}
            {isDone ? (
              <Button onClick={next}>
                {isCorrect ? 'Next person' : 'New person'}
              </Button>
            ) : (
              <Button
                onClick={submit}
                disabled={!guesses.every((g) => g.value)}
              >
                Submit
              </Button>
            )}
          </Flex>

          <Button
            variant="subtle"
            leftIcon={<IconClipboard />}
            onClick={() => {
              navigator.clipboard.writeText(
                `https://whoamai.appadem.in/question/${question.questionId}`
              )
              let originalText = clipboardButtonRef.current.innerText
              clipboardButtonRef.current.innerText = 'Copied!'
              setTimeout(() => {
                clipboardButtonRef.current.innerText = originalText
              }, 2000)
            }}
          >
            <span ref={clipboardButtonRef}>Copy link to person</span>
          </Button>
        </Flex>
      </Center>
    </>
  )
}
