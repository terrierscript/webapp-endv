import { Box, Wrap } from "@chakra-ui/react"
import React, { FC } from "react"
import { InspectWordLink } from "../../Link"


export const Words: FC<{ words: string[] }> = ({ words }) => {
  return <Wrap shouldWrapChildren wrap={"wrap"}>{words?.map(l => {
    return <Box key={l} textDecoration="underline">
      <InspectWordLink word={l} />
    </Box>
  })}</Wrap>
}
