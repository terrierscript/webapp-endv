import React, { FC, useEffect, useMemo } from "react"
import { Box, Button, Stack, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { useNestedLemma } from "./useNestedLemma"
import { RelationTab } from "./tabs/RelationTab"
import { NotFound } from "./NotFound"
import { isTruthy } from 'typesafe-utils'
import { QuizLink } from "../../Link"
import { LemmaProps } from "./Lemma"
import { FormsTab } from "./tabs/FormsTab"
import { useRouter } from "next/router"
import { DefinitionTab } from "./tabs/DefinitionTab"

const tabTypes = ["definitions", "relations", "forms"] as const

type TabType = typeof tabTypes[number]

type TabProps = { type: TabType }

const TabHeader: FC<TabProps & { formsCount?: number }> = ({ type, formsCount }) => {
  switch (type) {
    case "definitions":
      return <>Definitions</>
    case "relations":
      return <>Relations</>
    case "forms":
      return <>Forms ({ formsCount})</>
  }
}

const TabBody: FC<TabProps & LemmaProps> = ({ type, ...lemmaProps }) => {
  switch (type) {
    case "definitions":
      return <DefinitionTab {...lemmaProps} />
    case "relations":
      return <RelationTab {...lemmaProps} />
    case "forms":
      return <FormsTab {...lemmaProps} />
  }
}


export const LemmaTab: FC<LemmaProps> = (props) => {
  const router = useRouter()
  useEffect(() => {
    console.log("xxx")
    router.events.on("hashChangeStart", () => {
      console.log("hashChangeStart")
    })
    router.events.on("hashChangeComplete", () => {
      console.log("hashChangeComplete")
    })
  }, [])
  // @ts-ignore
  const initialTab = Math.max(tabTypes.indexOf(location.hash.replace("#", "")), 0)

  const { word, initialData } = props
  const { data } = useNestedLemma(word, initialData)
  const formsCount = (data?.form?.length ?? 0)
  const formLemma: string[] = data?.form?.map(f => f.lemma?.writtenForm).filter(isTruthy) ?? []
  if (data && !data?.lexicalEntry) {
    return <NotFound word={word} appendCandidates={formLemma} />
  }

  return <>
    <Tabs
      onChange={(idx) => { location.hash = `#${tabTypes[idx]}` }}
      defaultIndex={initialTab}
      // isLazy
      variant="soft-rounded"
    >
      <TabList>
        {tabTypes.map(type =>
          <Tab key={type}>
            <TabHeader type={type} formsCount={formsCount} />
          </Tab>
        )}
      </TabList>
      <TabPanels>
        {tabTypes.map(type =>
          <TabPanel key={type}>
            <TabBody {...props} type={type} />
          </TabPanel>
        )}
      </TabPanels>
    </Tabs>
    <Stack>
      <Box>
        <QuizLink word={word}>
          <Button as="a" colorScheme="teal">Start Quiz</Button>
        </QuizLink>
      </Box>
    </Stack>
  </>
}
