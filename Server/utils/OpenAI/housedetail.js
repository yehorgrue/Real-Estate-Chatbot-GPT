const { OpenAI } = require("langchain/llms/openai");
const { PromptTemplate } = require("langchain/prompts");
const { LLMChain } = require("langchain/chains");

const dotenv = require("dotenv");
dotenv.config();

// We can construct an LLMChain from a PromptTemplate and an LLM.
const model = new OpenAI({ temperature: 0 });
const prompt = PromptTemplate.fromTemplate(
  `
  You are a key word extractor.
  You have to extract key word related with address from "{input}" and return that key word only.
  Return only the the value.
  `
);
const chain = new LLMChain({ llm: model, prompt });

exports.run = async (query) => {
  // The result is an object with a `text` property.
  try {
    const res = await chain.call({ input: query });
    return res;
  } catch (err) {
    return err;
  }
};
