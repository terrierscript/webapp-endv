import { AddIcon } from "@chakra-ui/icons"
import { Accordion, AccordionButton, AccordionItem, AccordionPanel, Box, Container, Heading, HStack, Link, List, ListItem, Stack } from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import  NextLink from "next/link"
import React from "react"
import { searchIndex } from "../../lib/dics"


const Words = ({ baseWord, words }) => {
  if (!words) {
    return null
  }
  return <HStack shouldWrapChildren wrap={"wrap"}>
    {words.map(word => {
      const color = baseWord !== word ? "blue.500" : "red.500"
      return <NextLink key={word} href={`/inspect/${word}`} passHref>
        <Link color={color} textDecoration="underline">{word.replaceAll("_", " ")}</Link>
      </NextLink>
    })}
  </HStack>
}
const Glossaries = ({ glossaries }) => {
  if (!glossaries) {
    return null
  }
  return <List>
    {glossaries.map(gl => {
      return <ListItem key={gl}>{gl}</ListItem>
    })}
  </List>
}
const Pointers = ({ pointers }) => {
  if (!pointers) {
    return null
  }
  return <Accordion>
    <AccordionItem>
      <AccordionButton>
        pointers
      </AccordionButton>
      <AccordionPanel>
      {pointers.map(pt => {
        return <Box key={pt.offset}>{pt.symbol}({pt.offset})</Box>
      })}
      </AccordionPanel>
    </AccordionItem>
  </Accordion>
}

const OffsetBlock = ({ baseWord, data }) => {
  return <Box border={1} borderRadius={4} borderColor="gray.200" borderStyle="solid" p={4}>
    <Box>
      <Words words={data.words} baseWord={baseWord} />
      <Glossaries glossaries={data.glossary} />
      <Pointers pointers={data.pointers} />
    </Box>
  </Box>

}
const IndexBlock = ({ baseWord, index }) => {
  console.log("ido",index.offsetData)
  const offsets = Object.values(index.offsetData)

  return <Box>
    <Heading size="xs">{index.pos}</Heading>
    <Stack>
      {index.offsetData.map((_offset) => {
        return Object.values(_offset).map((data:any) => {

          return <Box key={data.offset}>
            <OffsetBlock data={data} baseWord={baseWord}/>
          </Box>
        })
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
      {index.map(idx => {
        return <IndexBlock key={idx.pos} baseWord={word} index={idx} />
      })}
    </Box>
  </Container>
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { word } = ctx.query
  const wd = word.toString().replace(/ /g, "_")
  const index = searchIndex(wd)
  return {
    props: { word, index }
  }
}

export default Page