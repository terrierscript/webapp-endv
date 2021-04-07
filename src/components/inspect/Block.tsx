import { Box, BoxProps } from "@chakra-ui/react"
import React from "react"


export const Block = (props: BoxProps) => <Box
  boxShadow="md"
  p={2}
  {...props} />

export const BBlock = (props: BoxProps) => <Block bg="rgba(10,0,0,0.05)" {...props} />