
import { ExternalLinkIcon } from "@chakra-ui/icons"
import { HStack, Icon, Link, LinkProps } from "@chakra-ui/react"
import NextLink from "next/link"
import React, { FC } from "react"


export const InspectWordLink: FC<{ word: string, withExternal?: boolean } & LinkProps> = ({ word, color = "blue.500", withExternal = false, children, ...linkProps }) => {
  return <HStack>
    <NextLink key={word} href={`/inspect/${word}`} passHref >
      {children ??
        <Link color={color} {...linkProps} textDecoration="underline">
          {word && word.replaceAll("_", " ")}
        </Link>
      }
    </NextLink>
    {withExternal && <a href={`/inspect/${word}`} target="_blank" >
      <ExternalLinkIcon />
    </a>}
  </HStack>
}

export const QuizLink: FC<{ word: string } & LinkProps> = ({ word, children, ...linkProps }) => {
  return <NextLink key={word} href={`/quiz/${word}`} passHref >
    <Link  {...linkProps}>
      {children}
    </Link>
  </NextLink>
}