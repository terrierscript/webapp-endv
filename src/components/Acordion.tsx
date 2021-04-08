import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, HStack, Spinner } from "@chakra-ui/react"
import React, { FC, ReactNode } from "react"

export const ItemAccordion: FC<{ title: ReactNode }> = ({ title, children }) => {

  return <Accordion allowToggle allowMultiple reduceMotion>
    <AccordionItem>{({ isExpanded }) => (
      <>
        <AccordionButton fontSize="sm" >
          <HStack>
            <AccordionIcon />
            <Box>
              {title}
            </Box>
          </HStack>
        </AccordionButton>
        <AccordionPanel>
          {isExpanded ? children : <Spinner />}
        </AccordionPanel>
      </>
    )}
    </AccordionItem>
  </Accordion>
}
