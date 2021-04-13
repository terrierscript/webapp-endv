import { Box, BoxProps } from "@chakra-ui/react"
import React from "react"


export const Block = (props: BoxProps) => <Box
  boxShadow="md"
  rounded="md"
  p={2}
  {...props} />

export const BBlock = (props: BoxProps) => <Block
  boxShadow="sm"
  bg="rgba(10,0,0,0.03)" {...props} />