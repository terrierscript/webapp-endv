import { GetServerSideProps, GetServerSidePropsResult } from "next"
import { getProps, InspectPage } from "../../components/inspect/InspectPage"

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const props: GetServerSidePropsResult<any> = await getProps(ctx.query)
  // const { word } = ctx.query
  return props
}

// 激重メモリリーク？

export default InspectPage
// export default (props: any) => <InspectPage {...props} />
