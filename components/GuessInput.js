import { Flex, Select, Text } from '@mantine/core'
import { IconCheck } from '@tabler/icons'

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

export default GuessInput
