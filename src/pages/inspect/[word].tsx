import { GetServerSideProps, GetServerSidePropsResult, GetStaticProps } from "next"
import { getProps, InspectPage } from "../../components/inspect/InspectPage"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const props: GetServerSidePropsResult<any> = await getProps(ctx.query)
  // const { word } = ctx.query
  return props
}

export default InspectPage

