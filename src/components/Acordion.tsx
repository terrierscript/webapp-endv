import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Box, Spinner } from "@chakra-ui/react"
import React, { useMemo, useState } from "react"

export const ItemAccordion = ({ title, children }) => {
  // const [expand, setExpand] = useState(false)
  // if (!expand) {
  //   return <Box onClick={() => setExpand(!expand)}>{title}</Box>
  // }
  // return <Box>{children}</Box>
  
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
