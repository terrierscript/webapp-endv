import { generateTree } from "../src/lib/tree"

const start = () => {

  console.log("start")
  console.log(JSON.stringify(generateTree("intuition"), null,2))
}

start()