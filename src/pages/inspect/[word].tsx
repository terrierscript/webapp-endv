import { GetServerSidePropsResult, GetStaticPaths, GetStaticProps } from "next"
import { getProps, InspectPage } from "../../components/inspect/InspectPage"
import { useRouter } from "next/router"
import React from "react"
import { Box, Spinner } from "@chakra-ui/react"

export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx.params) {
    return { notFound: true }
  }
  const props: GetServerSidePropsResult<any> = await getProps(ctx.params)
  // const { word } = ctx.query
  return {
    props,
    revalidate: 60
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking"
  }
}

const Page = (props: any) => {
  const router = useRouter()
  if (router.isFallback) {
    return <Box><Spinner /></Box>
  }
  return <InspectPage {...props} />
}

export default Page