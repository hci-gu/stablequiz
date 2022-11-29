import { Button, Center, Flex, Text, Title } from '@mantine/core'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Index() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const start = async () => {
    setLoading(true)
    const response = await (await fetch('/api/new-question')).json()
    router.push(`/question/${response.questionId}`)
  }

  return (
    <>
      <Head>
        <title>Who am aI?</title>
        <meta
          property="description"
          content="Guess which three people an AI generated image is."
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Who am aI?" />
        <meta
          property="og:description"
          content="Guess which three people an AI generated image is."
        />
        <meta
          property="og:image"
          content="https://whoamai.appadem.in/images/share.png"
        />
        <meta property="og:url" content="https://whoamai.appadem.in/" />
        <meta property="og:image:width" content={1200} />
        <meta property="og:image:height" content={627} />
      </Head>
      <Center>
        <Flex direction="column" gap={0} align="center" mt={128}>
          <Title
            order={1}
            size={96}
            sx={{
              '@media (max-width: 755px)': {
                fontSize: '48px',
              },
            }}
          >
            WHO AM <span style={{ fontSize: 32 }}>A</span>I?
          </Title>
          <Title
            order={2}
            weight={400}
            ta="center"
            sx={{
              '@media (max-width: 755px)': {
                fontSize: '18px',
              },
            }}
          >
            Guess which <strong>three</strong> people an AI generated image is.
          </Title>
          <Text mt={64} maw="500px" ta="center">
            When you press start you will get a generated image of three famous
            people merged together, can you guess who they are?
          </Text>
          <Button mt="lg" size="lg" onClick={start} loading={loading}>
            Start
          </Button>
        </Flex>
      </Center>
    </>
  )
}
