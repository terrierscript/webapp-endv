import { AddIcon } from "@chakra-ui/icons"
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Container, Heading, HStack, Link, List, ListItem, Spinner, Stack, UnorderedList } from "@chakra-ui/react"
import { GetServerSideProps } from "next"
import  NextLink from "next/link"
import React, { useEffect, useState } from "react"
import useSWR from "swr"
import { searchIndex } from "../../lib/dics"


const Words = ({ baseWord, words }) => {
  if (!words) {
    return null
  }
  return <HStack shouldWrapChildren wrap={"wrap"}>
    {words.map(word => {
      const color = baseWord !== word ? "blue.500" : "gray.500"
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
  return <UnorderedList fontSize="xs" >
    {glossaries.map(gl => {
      return <ListItem key={gl}>{gl}</ListItem>
    })}
  </UnorderedList>
}

const PointerContents = ({ pointers }) => {
  const pts = pointers.map( p => p.offset)
  const { data, error } = useSWR(`/api/search/offsets/${pts.join("/")}`)
  const [offsetData, setOffsetData] = useState([])
  console.log(data)
  useEffect(() => {
    if(!data){ return }
    const offs = Object.entries(data).map(([_offset, offsetData]) => {
      return Object.entries(offsetData).map(([_pos, data]) => data)
    }).flat(2)
    setOffsetData(offs)
  },[data])

  if (!data) {
    return <Spinner />
  }
  return <>{offsetData.map(off => <OffsetBlock data={off} />)}</>
}


const Pointers = ({ pointers }) => {
  const grouped = pointers
  console.log(pointers)
  if (!pointers) {
    return null
  }
  return <Accordion allowToggle onChange={(exp) => {
    if (exp !== 0) {
      return
    }
    console.log(pointers)
  }}>
    <AccordionItem >{({ isExpanded }) => (
      <>
        <AccordionButton>
          pointers
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          {isExpanded ? <PointerContents pointers={pointers} /> : <Spinner />}
        </AccordionPanel>
      </>
    )}
    </AccordionItem>
  </Accordion>
}

const OffsetBlock = ({ baseWord = "", data }) => {
  return <Box border={1} borderRadius={4} borderColor="gray.200" borderStyle="solid" p={4}>
    <Box>
      <Words words={data.words} baseWord={baseWord} />
      <Glossaries glossaries={data.glossary} />
      <Pointers pointers={data.pointers} />
    </Box>
  </Box>

}
const IndexBlock = ({ baseWord, index }) => {
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