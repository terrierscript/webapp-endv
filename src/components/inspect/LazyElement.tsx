import { Skeleton, Box, Stack, SkeletonText } from "@chakra-ui/react"
import React, { FC, useRef } from "react"
import { useIntersection } from "use-intersection"

const LoadingSkelton = () => <Stack>
  <Skeleton height="20px" />
  <Skeleton height="20px" />
  <Skeleton height="20px" />
</Stack>

export const LazyElement: FC<{}> = ({ children, }) => {
  const ref = useRef<HTMLDivElement>(null)
  const intersecting = useIntersection(ref, {
    rootMargin: '250px',
    once: true,
  })

  return <div ref={ref}>
    <Skeleton isLoaded={intersecting}>
      {children}
    </Skeleton>

    {/* {intersecting ? children : <LoadingSkelton />} */}
  </div>
}