import { Ollama } from "@langchain/ollama";

const llm = new Ollama({
  model: "llama3.2:1b", //"llama3", // Default value
  temperature: 0,
  maxRetries: 2,
  // other params...
});

const inputText = "Ollama is an AI company that ";

const completion = await llm.invoke(inputText);
console.log(completion)

// chaining https://js.langchain.com/docs/integrations/llms/ollama/#chaining

import { PromptTemplate } from "@langchain/core/prompts";

const prompt = PromptTemplate.fromTemplate(
  "How to say {input} in {output_language}:\n"
);

const chain = prompt.pipe(llm);
await chain.invoke({
  output_language: "German",
  input: "I love programming.",
});