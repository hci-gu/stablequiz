const getLocalCounterAndIncrement = () => {
  const counter = localStorage.getItem('counter') || 0
  localStorage.setItem('counter', Number(counter) + 1)
  return counter
}

const getLocalCounter = () => localStorage.getItem('counter') || 0

const getCounterFromUrl = (url) => {
  const urlParts = url.split('?')
  if (urlParts.length !== 2) return 0

  const params = urlParts[1].split('&').reduce((acc, param) => {
    const [key, value] = param.split('=')
    return { ...acc, [key]: value }
  }, {})

  return params.c || 0
}

export { getLocalCounterAndIncrement, getLocalCounter, getCounterFromUrl }
