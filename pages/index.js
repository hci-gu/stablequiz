import { Button, Center, Flex, Title } from '@mantine/core'
import { useRouter } from 'next/router'

export default function Index() {
  const router = useRouter()
  const start = async () => {
    const response = await (await fetch('/api/new-question')).json()
    router.push(`/question/${response.questionId}`)
  }

  return (
    <Center>
      <Flex direction="column" gap={0} align="center">
        <Title order={1} size={96}>
          Who am <span style={{ fontSize: 32 }}>A</span>I?
        </Title>
        <Title order={2} weight={400}>
          Guess which <strong>three</strong> people an AI generated image is.
        </Title>
        <Button mt="lg" size="lg" onClick={start}>
          Start
        </Button>
      </Flex>
    </Center>
  )
}
