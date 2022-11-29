import { Button, Center, Flex, Text, Title } from '@mantine/core'
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
  )
}
