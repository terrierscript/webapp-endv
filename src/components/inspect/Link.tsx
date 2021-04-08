
import { Link } from "@chakra-ui/react"
import NextLink from "next/link"
import React, { FC } from "react"


export const InspectWordLink: FC<any> = ({ word, color = "blue.500" }) => {
  return <NextLink key={word} href={`/inspect/${word}`} passHref >
    <Link color={color} >
      {word.replaceAll("_", " ")}
    </Link>
  </NextLink>
}