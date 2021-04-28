import 'core-js/features/string/replace-all'
import NextNprogress from 'nextjs-progressbar'
import { Box, Center, ChakraProvider, Container, Divider, Stack } from "@chakra-ui/react"
import React from "react"

const Footer = () => {
  return <Box>
    <Divider />
    <Box textAlign="right" px={10} color="gray.500">
      <Stack>
        <Box>
          <a href="http://wordnet.princeton.edu/">WordNet by Princeton University</a>
        </Box>
        <Box>
          <a href="https://github.com/globalwordnet/english-wordnet">English WordNet</a>
        </Box>
      </Stack>
    </Box>
  </Box>
}
// @ts-ignore
function MyApp({ Component, pageProps }) {
  return <ChakraProvider>
    <NextNprogress />
    <Box bg="gray.100" minHeight="100vh">
      <Box bg="white" minHeight="90vh">
        <Container bg="white" maxW="8xl" p={4}>
          <Component {...pageProps} />
        </Container>
      </Box>
      <Footer />
    </Box>
  </ChakraProvider>
}

export default MyApp
