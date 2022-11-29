import { Button } from '@mantine/core'
import { IconClipboard } from '@tabler/icons'
import { useRef } from 'react'

const CopyLinkButton = ({ questionId }) => {
  const ref = useRef()

  return (
    <Button
      variant="subtle"
      leftIcon={<IconClipboard />}
      onClick={() => {
        navigator.clipboard.writeText(
          `https://whoamai.appadem.in/question/${questionId}`
        )
        let originalText = ref.current.innerText
        ref.current.innerText = 'Copied!'
        setTimeout(() => {
          ref.current.innerText = originalText
        }, 2000)
      }}
    >
      <span ref={ref}>Copy link to this person</span>
    </Button>
  )
}

export default CopyLinkButton
