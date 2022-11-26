import { useState, useEffect, useCallback } from 'react'

const PersonInput = ({ onChange, answers }) => {
  const [name, setName] = useState('')
  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={e => {
          setName(e.target.value)
          onChange(e.target.value)
        }}
      />
      {answers && answers.includes(name) && <span>Correct!</span>}
    </div>
  )
}

export default function Home() {
  const [questionId, setQuestionId] = useState(undefined)
  const [image, setImage] = useState(null)
  const [guess1, setGuess1] = useState('')
  const [guess2, setGuess2] = useState('')
  const [guess3, setGuess3] = useState('')
  const [correct, setCorrect] = useState(undefined)
  const [answers, setAnswers] = useState(undefined)
  const [loading, setLoading] = useState(false)

  const newQuestion = useCallback(() => {
    setAnswers(undefined)
    setCorrect(undefined)
    setLoading(true)
    fetch('/api/new-question')
      .then(res => res.json())
      .then(data => {
        setLoading(false)
        setImage(data.image)
        setQuestionId(data.questionId)
      })
  }, [])

  // useEffect(() => {
  //   newQuestion()
  // }, [newQuestion])

  const makeGuess = useCallback(() => {
    console.log({ guess1, guess2, guess3 })
    fetch('/api/submit-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionId,
        guess1,
        guess2,
        guess3,
      }),
    })
    .then(res => res.json())
    .then(data => {
      console.log({ data })
      setCorrect(data.correct)
      setAnswers(data.answers)
    })
  }, [questionId, guess1, guess2, guess3])

  return (
    <div style={{ maxWidth: 512, margin: '0 auto' }}>
      { !loading && !image ? <button onClick={newQuestion}>Start</button> : <>
        <h1>Who is this?</h1>
        {loading ? 'Loading...' : (<>
          <img src={image} alt="Image of a combination of three famous people" />
          <PersonInput onChange={setGuess1} answers={ answers }/>
          <PersonInput onChange={setGuess2} answers={ answers }/>
          <PersonInput onChange={setGuess3} answers={ answers }/>
          { answers && <div>{`Correct answers: ${answers.join(', ')}`}</div> }
          <button onClick={makeGuess}>Guess</button>
          <button onClick={newQuestion}>New Question</button>
          {correct === true && <p>Correct!</p>}
          {correct === false && <p>Wrong!</p>}
        </>)}
      </>}
    </div>
  )
}
