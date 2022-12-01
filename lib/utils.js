const getLocalCounterAndIncrement = () => {
  const counter = localStorage.getItem('counter') || 0
  localStorage.setItem('counter', Number(counter) + 1)
  return counter
}

const getLocalCounter = () => localStorage.getItem('counter') || 0

const getCounterFromUrl = (url) => {
  const params = getQueryParamsFromUrl(url)

  return params.c || 0
}

const getQueryParamsFromUrl = (url) => {
  const urlParts = url.split('?')
  if (urlParts.length !== 2) return {}

  const params = urlParts[1].split('&').reduce((acc, param) => {
    const [key, value] = param.split('=')
    return { ...acc, [key]: value }
  }, {})

  return params
}

export {
  getLocalCounterAndIncrement,
  getLocalCounter,
  getCounterFromUrl,
  getQueryParamsFromUrl,
}
