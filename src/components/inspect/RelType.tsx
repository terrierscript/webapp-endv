import { Badge, Box, Tooltip } from "@chakra-ui/react"
import React from "react"
import { relTypeDescriptions } from "./refTypeDescriptions"

export const RelType = ({ relType }: { relType?: string} ) => {
  if (!relType) {
    return null
  }
  // @ts-ignore
  const label = relTypeDescriptions[relType]
  return <Tooltip hasArrow label={label} fontSize="sm" placement="top-start">
    <Badge>{relType}</Badge>
  </Tooltip>
}
