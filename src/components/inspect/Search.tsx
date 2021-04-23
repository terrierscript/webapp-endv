import React, { useState } from "react"
import { Button, HStack, Input } from "@chakra-ui/react"
import { InspectWordLink } from "../Link"
import { useRouter } from 'next/router'
export const Search = () => {
  const [value, setValue] = useState("")
  const router = useRouter()
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      router.push(`/inspect/${value}`)
    }}>
      <HStack py={2}>
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        {/* <InspectWordLink word={value}> */}
        <Button type="submit" >Search</Button>
        {/* </InspectWordLink> */}
      </HStack>
    </form>
  )
}
