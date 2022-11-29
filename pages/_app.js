import Head from 'next/head'
import {
  ActionIcon,
  Anchor,
  AppShell,
  ColorSchemeProvider,
  Container,
  Flex,
  Footer,
  MantineProvider,
  useMantineColorScheme,
} from '@mantine/core'
import { Analytics } from '@vercel/analytics/react'
import { IconMoonStars, IconSun } from '@tabler/icons'
import { useState } from 'react'
import { css, Global } from '@emotion/react'

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
    <AppShell
      footer={
        <Footer
          p="sm"
          style={{ fontSize: 13 }}
          sx={{
            '@media (max-width: 755px)': {
              padding: '8px',
              fontSize: '11px !important',
            },
          }}
        >
          <Flex
            sx={{
              '@media (max-width: 755px)': {
                justifyContent: 'center',
              },
            }}
          >
            Made by
            <Anchor href="https://twitter.com/rrostt" target="_blank" mx={4}>
              @rrostt
            </Anchor>
            and
            <Anchor
              href="https://twitter.com/Sebasti_Andreas"
              target="_blank"
              mx={4}
            >
              @sebasti_andreas
            </Anchor>
            from
            <Anchor href="https://hci.gu.se/appademin" target="_blank" mx={4}>
              Appademin
            </Anchor>
          </Flex>
        </Footer>
      }
    >
      <Container pos="absolute" right={0} mt={0}>
        <DarkMode />
      </Container>
      <Container pb={64}>{children}</Container>
    </AppShell>
  )
}

function MyApp({ Component, pageProps }) {
  const [colorScheme, setColorScheme] = useState('light')
  return (
    <>
      <Global
        styles={css`
          @media screen and (-webkit-min-device-pixel-ratio: 0) {
            select:focus,
            textarea:focus,
            input:focus {
              font-size: 16px;
            }
          }
        `}
      />
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
