const { OpenAI } = require("langchain/llms/openai");
const { PromptTemplate } = require("langchain/prompts");
const { LLMChain } = require("langchain/chains");

const dotenv = require("dotenv");
dotenv.config();

// We can construct an LLMChain from a PromptTemplate and an LLM.
const model = new OpenAI({ temperature: 0 });
const prompt = PromptTemplate.fromTemplate(
  `
  You are a real estate assistant.
  You have to recommend the area based on the query bellow.

  You have return only the answer. Don't attach 'Answer:'

  query: {input}
  `
);
const chain = new LLMChain({ llm: model, prompt });

exports.run = async (query) => {
  // The result is an object with a `text` property.
  const res = await chain.call({ input: query });
  console.log(res);
  return res;
};
