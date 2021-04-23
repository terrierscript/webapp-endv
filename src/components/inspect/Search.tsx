import React, { useState } from "react"
import { Button, HStack, Input, InputGroup, InputLeftElement } from "@chakra-ui/react"
import { useRouter } from 'next/router'
import { SearchIcon } from "@chakra-ui/icons"
export const Search = () => {
  const [value, setValue] = useState("")
  const router = useRouter()
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      router.push(`/inspect/${value}`)
    }}>
      <HStack py={2}>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon color="gray.300" />}
          />

          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </InputGroup>
        {/* <InspectWordLink word={value}> */}
        <Button type="submit" >Search</Button>
        {/* </InspectWordLink> */}
      </HStack>
    </form>
  )
}
