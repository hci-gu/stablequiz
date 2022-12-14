import {
  Anchor,
  Button,
  Center,
  Container,
  Flex,
  Image,
  LoadingOverlay,
  Title,
} from '@mantine/core'
import { useState } from 'react'
import Confetti from 'react-confetti'
import { useRouter } from 'next/router'
import people from '../../people.json'
import { getQuestion } from '../../lib/questions'
import Head from 'next/head'
import GuessInput from '../../components/GuessInput'
import CopyLinkButton from '../../components/CopyLinkButton'
import { getLocalCounter, getLocalCounterAndIncrement } from '../../lib/utils'

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

const initialState = () => [
  { value: null, correct: null },
  { value: null, correct: null },
  { value: null, correct: null },
]

const SubmitButton = ({ submit, disabled, variant, children }) => {
  const [loading, setLoading] = useState(false)

  return (
    <Button
      onClick={async () => {
        setLoading(true)
        await submit()
        setLoading(false)
      }}
      loading={loading}
      disabled={disabled}
      variant={variant}
    >
      {children}
    </Button>
  )
}

export default function Question({ question, people = [] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [guesses, setGuesses] = useState(initialState())
  const [showHints, setShowHints] = useState(false)
  const [loadingHints, setLoadingHints] = useState(false)
  const [hints, setHints] = useState([])

  const isCorrect = guesses.every((guess) => guess.correct)
  const isDone = guesses.every((guess) => guess.answer)

  const submit = async () => {
    const counter = getLocalCounter()
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
        hints: showHints ? hints : [],
        counter,
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
    setLoading(true)
    setShowHints(false)
    const counter = getLocalCounterAndIncrement()
    const response = await (
      await fetch(`/api/new-question?c=${counter}`)
    ).json()
    router.push(`/question/${response.questionId}`)
    setGuesses(initialState())
  }

  const loadHints = async () => {
    setLoadingHints(true)
    const response = await fetch(`/api/get-hints?id=${question.questionId}`)
    const data = await response.json()
    setHints(data.hints)
    setLoadingHints(false)
    setShowHints(true)
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
        <meta
          property="og:url"
          content={`https://whoamai.appadem.in/question/${question.id}`}
        />
      </Head>
      <Center>
        {isCorrect && <Confetti recycle={false} />}
        <Flex direction="column" gap="md" align="center">
          <Center>
            <Anchor href="/" variant="text">
              <Title order={1} size={32}>
                WHO AM <span style={{ fontSize: 16 }}>A</span>I?
              </Title>
            </Anchor>
          </Center>
          <Container
            sx={{
              width: 512,
              position: 'relative',
              '@media (max-width: 1540px)': {
                width: '468px !important',
              },
              '@media (max-width: 768px)': {
                width: '100% !important',
              },
            }}
          >
            <Image
              alt="AI generated image of three separate famous people"
              src={question.image}
              radius="lg"
              withPlaceholder
              onLoad={() => setLoading(false)}
            />
            <LoadingOverlay
              visible={loading}
              w="100%"
              h="100%"
              loaderProps={{
                variant: 'bars',
              }}
            />
          </Container>
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
          {showHints && (
            <Flex direction="column" align="center">
              {hints.map((hint, index) => (
                <Container
                  key={`hint_${index}`}
                  sx={{
                    fontStyle: 'italic',
                    marginBottom: '1em',
                  }}
                >
                  {hint}
                </Container>
              ))}
            </Flex>
          )}
          <Flex gap="xs">
            {!isDone && !showHints && (
              <Button
                onClick={loadHints}
                variant="outline"
                loading={loadingHints}
              >
                Hints
              </Button>
            )}
            {!isDone && showHints && (
              <SubmitButton submit={submit} variant="outline">
                Give up
              </SubmitButton>
            )}
            {isDone ? (
              <Button onClick={next}>
                {isCorrect ? 'Next person' : 'New person'}
              </Button>
            ) : (
              <SubmitButton
                submit={submit}
                disabled={!guesses.every((g) => g.value)}
              >
                Submit
              </SubmitButton>
            )}
          </Flex>

          <CopyLinkButton questionId={question.questionId} />
        </Flex>
      </Center>
    </>
  )
}
