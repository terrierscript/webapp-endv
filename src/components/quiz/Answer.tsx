import { Text, Tabs, TabList, Tab, TabPanel, TabPanels, Wrap, Divider } from "@chakra-ui/react"
import React, { FC } from "react"
import { InspectWordLink } from "../Link"
import { WordPopover } from "../WordPopover"
import { CompactDefinition } from "../inspect/lemma/CompactDefinition"

const Answer: FC<{ word: string }> = ({ word }) => {
  return <WordPopover word={word}>
    <Text cursor={"pointer"}>{word}</Text>
  </WordPopover>
}
export const AnswerTabs: FC<{ words: string[] }> = ({ words }) => {
  return <Tabs variant="soft-rounded"
  >
    <TabList>
      <Wrap>

        {words.map(w => <Tab key={w}>{w}</Tab>)}
      </Wrap>
    </TabList>
    <Divider p={2} />
    <TabPanels>
      {words.map(w => <TabPanel key={w}>
        <InspectWordLink word={w} withExternal={true} />
        <CompactDefinition word={w} />
      </TabPanel>)}
    </TabPanels>
  </Tabs>
}
