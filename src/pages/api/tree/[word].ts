
// import { NextApiHandler } from "next"
// import { searchSynset, searchLemma } from "../../../lib/dics"
// import { generateTree } from "../../../lib/tree"

// const handler: NextApiHandler = async (req, res) => {
//   const { word } = req.query
//   if (typeof word !== "string") {
//     res.status(400).end()
//     return 
//   }
//   const tree = generateTree(word)
//   res.json(tree)
// }

// export default handler