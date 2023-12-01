const { ChatOpenAI } = require("langchain/chat_models/openai");
const {
  initializeAgentExecutorWithOptions,
  AgentActionOutputParser,
  AgentExecutor,
  LLMSingleActionAgent,
  ChatConversationalAgent
} = require("langchain/agents");
const { ConversationSummaryBufferMemory } = require("langchain/memory");
const { OpenAI } = require("langchain/llms/openai");
const { ConversationChain } = require("langchain/chains");
const {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate
} = require("langchain/prompts");

const LLMChain = require("langchain/chains");

const { SerpAPI } = require("langchain/tools");
const { Calculator } = require("langchain/tools/calculator");

const dotenv = require("dotenv");
dotenv.config();

const llm = new ChatOpenAI({ temperature: 0 });

// summary buffer memory
const memory = new ConversationSummaryBufferMemory({
  llm: llm,
  maxTokenLimit: 10,
  returnMessages: true,
  memoryKey: "chat_history",
  inputKey: "input",
  outputKey: "output"
});

const introduction_template = `
You are an AI assistant to help human buy a house!
Human who asks questions to you is going to buy a house and get the image url of the houses.
First of all you have to respond to natural questions.
You will use the knowldege in the domain of house detials and buying.
If human says that he is going to buy an house, you have to ask the details of house like area, size, type, the limit of price and other related details.
If you do need more information, you can search the answer using the available tools.
You will not fabricate an answer, and if you do not know the answer, will simply answer with 'I don't know'.
You will always list your sources images with a strict SOURCES: section.
`;

const systemMessage = `${introduction_template}`;
const humanMessage = `
Begin!
Conversation history:
{chat_history}
Answer the following query:
Human: {input}
`;

exports.run = async query => {
  process.env.LANGCHAIN_HANDLER = "langchain";

  // const SerpAPITool = new SerpAPI({
  //   name: "Search",
  //   apikey: process.env.SERPAPI_API_KEY
  // });

  // const tools = [SerpAPITool];
  const tools = [
    new SerpAPI(process.env.SERPAPI_API_KEY, {
      location: "Austin,Texas,United States",
      hl: "en",
      gl: "us"
    }),
    new Calculator()
  ];

  const full_prompt = ChatConversationalAgent.createPrompt({
    tools: tools,
    args: {
      systemMessage: systemMessage,
      humanMessage: humanMessage,
      inputVariables: ["input", "chat_history"]
    }
  });

  const llm_chain = await LLMChain(llm, full_prompt);

  const agent = await ChatConversationalAgent({
    llm: llm_chain,
    tools: tools,
    args: full_prompt
  });

  const executor = await AgentExecutor.fromAgentAndTools({
    agent: agent,
    tools: tools,
    verbose: true,
    memory: memory
  });

  const result = executor.call(query);

  // const result = "How are you?";

  // const chatPrompt = ChatPromptTemplate.fromPromptMessages([
  //   SystemMessagePromptTemplate.fromTemplate(
  //     `
  //     The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.
  //     AI is the assist of buying houses. Answer the user's questions.
  //     Use chatHistory bellow to remember what did you chat.
  //     {chat_history}
  //     `
  //   ),
  //   new MessagesPlaceholder("history"),
  //   HumanMessagePromptTemplate.fromTemplate("{input}")
  // ]);

  // const executor = await initializeAgentExecutorWithOptions(tools, model, {
  //   agentType: "chat-conversational-react-description",
  //   agentArgs: chatPrompt,
  //   verbose: true,
  //   memory: chatPromptMemory
  // });

  // const input0 = "hi, i am bob";

  // const result0 = await executor.call({ input: input0 });

  return result;
};
