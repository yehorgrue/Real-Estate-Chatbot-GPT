const { OpenAI } = require("langchain/llms/openai");
const { PromptTemplate } = require("langchain/prompts");
const { LLMChain } = require("langchain/chains");

require("dotenv").config();

// We can construct an LLMChain from a PromptTemplate and an LLM.
const model = new OpenAI({ temperature: 0 });
const prompt = PromptTemplate.fromTemplate(
  `
  You are a real estate assistant.
  You have to respond to "{input}".
  Return just answer. Don't attach "Answer:"
  `
);
const chain = new LLMChain({ llm: model, prompt });

exports.run = async (query) => {
  // The result is an object with a `text` property.
  try {
    const res = await chain.call({ input: query });
    return res.text.trim();
  } catch (err) {
    console.error(err);
    return "OpenAI failed!";
  }
};
