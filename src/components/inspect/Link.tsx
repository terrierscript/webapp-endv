
import { Link } from "@chakra-ui/react"
import NextLink from "next/link"
import React from "react"

export const InspectWordLink = ({ word,color="blue.500" }) => {
  return <NextLink key={ word } href = {`/inspect2/${word}`} passHref >
    <Link color={color} textDecoration="underline">
      {word.replaceAll("_", " ")}
    </Link>
  </NextLink>
}