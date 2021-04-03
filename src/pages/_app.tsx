import { Box, Center, ChakraProvider, Container, Divider, Stack } from "@chakra-ui/react"
import React from "react"

const Footer = () => {
  return <Box>
    <Divider/>
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
function MyApp({ Component, pageProps }) {
  return <ChakraProvider>
    <Container minHeight="90vh">
      <Component {...pageProps} />
    </Container>
    <Footer />
  </ChakraProvider>
}

export default MyApp
