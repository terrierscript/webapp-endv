
import { Link, LinkProps } from "@chakra-ui/react"
import NextLink from "next/link"
import React, { FC } from "react"


export const InspectWordLink: FC<{ word: string } & LinkProps> = ({ word, color = "blue.500", children, ...linkProps }) => {
  return <NextLink key={word} href={`/inspect/${word}`} passHref >
    {children ??
      <Link color={color} {...linkProps} textDecoration="underline">
        {word && word.replaceAll("_", " ")}
      </Link>
    }
  </NextLink>
}