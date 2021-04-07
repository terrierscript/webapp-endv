import { Box, BoxProps } from "@chakra-ui/react"
import React from "react"


export const Block = (props: BoxProps) => <Box
  boxShadow="md"
  p={2}
  {...props} />
