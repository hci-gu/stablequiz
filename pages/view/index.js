import { Anchor, Card, Image, SimpleGrid } from '@mantine/core'
import questions from '../../questions.json'

export default function Page() {
  console.log(questions[0])
  return (
    <>
      <SimpleGrid cols={3}>
        {questions.map((q) => (
          <Card>
            <Image src={q.image} />
            <Anchor
              href={`https://whoamai.appadem.in/question/${q.questionId}`}
            >
              {q.people.join(', ')}
            </Anchor>
          </Card>
        ))}
      </SimpleGrid>
    </>
  )
}
