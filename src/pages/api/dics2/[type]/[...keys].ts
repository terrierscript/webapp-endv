
import { NextApiHandler } from "next"
import { resourceHandler } from "../../../../lib/resources"

const handler: NextApiHandler = async (req, res) => {
  const { type, keys } = req.query
  const k = [keys].flat().map(k => k.split(",")).flat()

  const result = resourceHandler(type.toString(), k)
  res.json(result)
}

export default handler

