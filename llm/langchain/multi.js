import { Ollama } from "@langchain/ollama";
import * as fs from "node:fs/promises";

const imageData = await fs.readFile("../../../../../examples/hotdog.jpg");

const model = new Ollama({
  model: "llava",
}).bind({
  images: [imageData.toString("base64")],
});

const res = await model.invoke("What's in this image?");
console.log(res);