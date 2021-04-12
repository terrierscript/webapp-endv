import React, { FC } from "react"
import { Box, HStack, Spinner } from "@chakra-ui/react"

// const Relations = ({ lexicalEntry }: any) => {
//   useSynsetGroupedRelation({ lexicalEntry })
//   return null
// }
export const Loading: FC<{}> = ({ children }) => <HStack p={2}>
  <Spinner />
  <Box>{children}</Box>
</HStack>
