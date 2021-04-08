import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Spinner } from "@chakra-ui/react"
import React, { FC, ReactNode } from "react"

export const ItemAccordion: FC<{ title: ReactNode }> = ({ title, children }) => {

  return <Accordion allowToggle allowMultiple reduceMotion>
    <AccordionItem>{({ isExpanded }) => (
      <>
        <AccordionButton>
          {title}
          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel>
          {isExpanded ? children : <Spinner />}
        </AccordionPanel>
      </>
    )}
    </AccordionItem>
  </Accordion>
}
