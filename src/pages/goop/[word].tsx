import { AddIcon } from "@chakra-ui/icons"
import { Box, Container, Heading, HStack, Link, List, ListItem, Stack } from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import  NextLink from "next/link"
import React from "react"
import { searchIndex } from "../../lib/dics"


const Words = ({baseWord, words }) => {
  return        <HStack>
            {words.map(word => {
              console.log(baseWord, word)
              const color = baseWord !== word ? "blue.500" : "red.500"
              return <NextLink href={`/goop/${word}`} passHref>
                <Link key={word}
                color={color}>{word}</Link>
                </NextLink>
            })}
          </HStack>
  
}
const IndexBlock = ({ baseWord, index }) => {
  return <Box>
    <Heading size="xs">{index.pos}</Heading>
    <Stack>
      {index.offsetData.map(offset => {
        return <Box key={offset.offset}>
          <Box>
            <Words words={offset.word} baseWord={baseWord}/>
            <List >
            {offset.glossary.map(gl => {
              return <ListItem key={gl}>{gl}</ListItem>
            }) }
            </List>
          </Box>
          {/* <AddIcon />
          <Box>
            {offset.}
          </Box> */}
        </Box>
      })}
    </Stack>
  </Box>
}

export const Page = ({ word, index }) => {
  if (!index) {
    return <Box>not found</Box>
  }
  return <Container>
    <Box>
      <Heading>{word}</Heading>
      {index.map(idx => <IndexBlock key={idx} baseWord={word} index={idx} />)}
    </Box>
  </Container>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { word } = ctx.query
  console.log(word)
  const wd = word.toString().replace(/ /g, "_")
  const index = searchIndex(wd)
  return {
    props: { word, index }
  }
}

export default Page