import Graph from "react-graph-vis";
import React, { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import useSWR from "swr"
import { GetStaticProps } from "next"
import { searchSynset, searchLemma } from "../../lib/dics"


// export const getStaticPaths = async () => ({
//   paths: [],
//   fallback: true,
// })
export const getServerSideProps: GetStaticProps = async (ctx) => {
  console.log("gsp")
  const word = ctx.params.word.toString()
  const index= searchLemma(word)
  const offsets = index.offsets.map(offset => searchSynset(offset))
  // const initialData = generateInitialNodeEdge(index, offsets)
  // console.log("XXX",initialData)
  return {
    props: { word, index, offsets },
    // revalidate: false
  }
}

type Data = {
  nodes: any[]
  edges: any[]
}

const generateInitialNodeEdge = (index, offsets): Data => {
  return {
    nodes: [
      { id: index.lemma, label: index.lemma, title: index.lemma , color: "red"},
      ...offsets.map(off => {
        const t = off.words.join(",")
        return {
          id: off.offset.toString(),
          // title: off.glossary.join("\n"),
          label: t
        }
      })
    ],
    edges: offsets.map(off => {
      return { from: index.lemma, to: off.offset.toString()}
    })
  }
}

const options = {
  layout: {
    // hierarchical: true
    hierarchical: false
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



export const Page = ({ word, index, offsets }) => {
  const initialData = generateInitialNodeEdge(index, offsets )
  const [offsetData, setOffsetData] = useState(Object.fromEntries(offsets.map(off => {
    return [off.offset,off]
  })))
  const [networkData, setNetworkData] = useState(initialData)
  // const { data, error } = useSWR(`/api/search/words/${word}`)
  // console.log("off",offsets)
  // console.log("nd",networkData)
  const events = {
    select: (event) => {
      console.log(event)
      event.nodes.map(node => {
        const off = offsetData[node]
        if (!off) {
          return
        }
        const pts = off.pointers
        const ptIds = pts.map(pt => pt.offset)
        fetch(`/api/search/offsets/${ptIds.join("/")}`).then(r => r.json()).then(r => {
          if (!r) {
            return
          }
          setOffsetData({ ...offsetData, ...r })
          const entries = Object.entries(r)
          const newNodes = entries.map(([offset, data]) => {
            console.log(offset,data)
            return {
              id: offset,
              // @ts-ignore
              label: data.words.join(","),
              // ...event.center
            }
          })
          const newEdges = entries.map(([offset, data]) => {
            return { from: node, to: offset }
          })

          setNetworkData({
            nodes: [
              ...networkData.nodes,
              ...newNodes,
            ],
            edges: [
              ...networkData.edges,
              ...newEdges
            ]
          })
        })
      })
    }
  }
  console.log("nd",networkData)
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
    graph={networkData}
    options={options}
    events={events}
    // interaction={{ hover: true }}
  />


}

export default Page