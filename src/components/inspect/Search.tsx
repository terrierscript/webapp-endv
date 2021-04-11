import React, { useState } from "react"
import { Button, HStack, Input } from "@chakra-ui/react"
import { InspectWordLink } from "./Link"

export const Search = () => {
  const [value, setValue] = useState("")
  return <HStack py={2}>
    <Input value={value} onChange={(e) => setValue(e.target.value)} />
    <InspectWordLink word={value}>
      <Button>Search</Button>
    </InspectWordLink>
  </HStack>
}
