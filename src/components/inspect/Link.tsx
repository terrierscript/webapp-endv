
import { Link, LinkProps } from "@chakra-ui/react"
import NextLink from "next/link"
import React, { FC } from "react"


export const InspectWordLink: FC<{ word: string } & LinkProps> = ({ word, color = "blue.500", ...linkProps }) => {
  return <NextLink key={word} href={`/inspect/${word}`} passHref >
    <Link color={color} {...linkProps}>
      {word.replaceAll("_", " ")}
    </Link>
  </NextLink>
}