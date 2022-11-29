import Head from 'next/head'
import {
  ActionIcon,
  ColorSchemeProvider,
  Container,
  MantineProvider,
  useMantineColorScheme,
} from '@mantine/core'
import { Analytics } from '@vercel/analytics/react'
import { IconMoonStars, IconSun } from '@tabler/icons'
import { useState } from 'react'

const DarkMode = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const dark = colorScheme === 'dark'

  return (
    <ActionIcon
      variant="outline"
      color={dark ? 'yellow' : 'blue'}
      onClick={() => toggleColorScheme()}
      title="Toggle color scheme"
    >
      {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
    </ActionIcon>
  )
}

const Layout = ({ children }) => {
  return (
    <>
      <Container pos="absolute" right={0} mt={4}>
        <DarkMode />
      </Container>
      <div style={{ margin: '32px auto', width: '95%' }}>{children}</div>
    </>
  )
}

function MyApp({ Component, pageProps }) {
  const [colorScheme, setColorScheme] = useState('light')
  return (
    <>
      <Head>
        <title>Page title</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={(value) =>
          setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))
        }
      >
        <MantineProvider
          theme={{ colorScheme }}
          withGlobalStyles
          withNormalizeCSS
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MantineProvider>
      </ColorSchemeProvider>
      <Analytics />
    </>
  )
}

export default MyApp
