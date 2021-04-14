import { Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverBody, PopoverHeader, Portal } from "@chakra-ui/react"
import React, { FC } from "react"
import { InspectWordLink } from "./Link"
import { CompactDefinition } from "./inspect/lemma/CompactDefinition"

export const WordPopover: FC<{ word: string }> = ({ word, children }) => {
  return <Popover isLazy>
    <PopoverTrigger>
      {children}
    </PopoverTrigger>
    <Portal>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          <InspectWordLink word={word} />
        </PopoverHeader>
        <PopoverBody>
          <CompactDefinition word={word} />
          {/* <Lemma word={term.text} /> */}
        </PopoverBody>
      </PopoverContent>
    </Portal>
  </Popover>
}
