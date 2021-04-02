import Graph from "react-graph-vis";
import React, { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import useSWR from "swr"
import { GetStaticProps } from "next"
import { searchData, searchIndex } from "../../lib/dics"


// export const getStaticPaths = async () => ({
//   paths: [],
//   fallback: true,
// })
export const getServerSideProps: GetStaticProps = async (ctx) => {
  console.log("gsp")
  const word = ctx.params.word.toString()
  const index= searchIndex(word)
  const offsets = index.offsets.map(offset => searchData(offset))
  const initialData = generateInitialNodeEdge(index, offsets)
  console.log("XXX",initialData)
  return {
    props: { word, index, offsets, initialData },
    // revalidate: false
  }
}
const generateInitialNodeEdge = (index, offsets) => {
  return {
    nodes: [
      { id: index.lemma, label: index.lemma, title: index.lemma , color: "red"},
      ...offsets.map(off => {
        const t = off.words.join(",")
        return {
          id: off.offset,
          title: off.glossary.join("\n"),
          label: t
        }
      })
    ],
    edges: offsets.map(off => {
      return {from: index.lemma, to: off.offset}
    })
  }
}

const options = {
  layout: {
    hierarchical: true
  },
  edges: {
    color: "#000000"
  },
  height: "500px",
  autoResize: true,
  interaction: {
    hover:true
  }
};


export const Page = ({ word, index, offsets, initialData }) => {
  const [networkData, setNetworkData] = useState(initialData)
  // const { data, error } = useSWR(`/api/search/words/${word}`)
  // console.log("off",offsets)
  // console.log("nd",networkData)

  useEffect(() => {
    // console.log(data)
  }, [word, index])

  if (!networkData) {
    return <div>loading</div>
  }
  // return <div>
  // {JSON.stringify(networkData)}
  // </div>
  return <Graph
    graph={initialData}
    options={options}
    // interaction={{ hover: true }}
  />


}

export default Page