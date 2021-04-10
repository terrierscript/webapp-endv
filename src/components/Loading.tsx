import React, { FC } from "react"
import { Box, Spinner } from "@chakra-ui/react"

// const Relations = ({ lexicalEntry }: any) => {
//   useSynsetGroupedRelation({ lexicalEntry })
//   return null
// }
export const Loading: FC<{}> = ({ children }) => <Box><Spinner />{children}</Box>
