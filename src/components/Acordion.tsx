import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Spinner } from "@chakra-ui/react"
import React, { FC } from "react"

export const ItemAccordion: FC<{title:string}> = ({ title, children }) => {
  
  return <Accordion allowToggle allowMultiple>
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
