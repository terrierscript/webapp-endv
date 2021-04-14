import { Skeleton, Box, Stack, SkeletonText } from "@chakra-ui/react"
import React, { FC, useRef } from "react"
import { useIntersection } from "use-intersection"

const LoadingSkelton = () => {
  return <Stack>
    <SkeletonText />
    <SkeletonText />
  </Stack>
}

export const LazyElement: FC<{}> = ({ children, }) => {
  const ref = useRef<HTMLDivElement>(null)
  const intersecting = useIntersection(ref, {
    rootMargin: '250px',
    once: true,
  })
  // const intersecting = false

  // return 
  return <div ref={ref}>
    {/* <Skeleton isLoaded={intersecting}>
    {children}
  </Skeleton>
 */}
    {intersecting ? children : <LoadingSkelton />}
  </div>
}