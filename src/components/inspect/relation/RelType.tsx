import { Badge, Box, Tooltip } from "@chakra-ui/react"
import React from "react"
import { relTypeDescriptions } from "./refTypeDescriptions"

const getStyleProps = (relType: string) => {
  switch (relType) {
    case "hypernym":
      return { colorScheme: "green", variant: "outline" }
    case "hyponym":
      return { colorScheme: "blue", variant: "outline" }
    case "derivation":
      return { variant: "solid" }
    case "antonym":
      return {
        colorScheme: "red",
        variant: "solid"
      }
  }
}

export const RelType = ({ relType }: { relType?: string }) => {
  if (!relType) {
    return null
  }
  // @ts-ignore
  const label = relTypeDescriptions[relType]
  const color = getStyleProps(relType)
  return <Tooltip hasArrow label={label} fontSize="sm" placement="top-start">
    <Badge {...color}>{relType.replaceAll("_", " ")}</Badge>
  </Tooltip>
}
