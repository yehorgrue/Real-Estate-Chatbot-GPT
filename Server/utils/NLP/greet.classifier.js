const { NlpManager } = require("node-nlp");

const fs = require("fs");

const data = fs.readFileSync(
  __dirname + "/model/" + "greet.classify.nlp",
  "utf8"
);
const manager = new NlpManager();
manager.import(data);

exports.run = async (query) => {
  const result = await manager.process("en", query);
  return result.intent;
};
