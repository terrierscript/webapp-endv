import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, HStack, Spinner } from "@chakra-ui/react"
import React, { FC, ReactNode, useState } from "react"
import { Loading } from "./Loading"

export const LazyLoadingAccordion: FC<{ title: ReactNode }> = ({ title, children }) => {
  const [loaded, setLoaded] = useState(false)
  return <Accordion allowToggle reduceMotion >
    <AccordionItem>{({ isExpanded }) => {
      setLoaded(isExpanded || loaded)
      return <>
        <AccordionButton fontSize="sm" >
          <HStack>
            <AccordionIcon />
            <Box>
              {title}
            </Box>
          </HStack>
        </AccordionButton>
        <AccordionPanel p={0} >
          {loaded ? children : <Spinner />}
        </AccordionPanel>
      </>
    }}
    </AccordionItem>
  </Accordion>
}
