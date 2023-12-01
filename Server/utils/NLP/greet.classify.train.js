const { NlpManager } = require("node-nlp");

const manager = new NlpManager({ languages: ["en"], forceNER: true });
// Adds the utterances and intents for the NLP
manager.addDocument("en", "Hi", "greet");
manager.addDocument("en", "Hey", "greet");
manager.addDocument("en", "Hello", "greet");
manager.addDocument("en", "How are you?", "greet");
manager.addDocument("en", "How are you doing?", "greet");
manager.addDocument("en", "What is your name?", "greet");
manager.addDocument("en", "How old are you?", "greet");
manager.addDocument("en", "Nice to meet you.", "greet");

manager.addDocument("en", "I am going to buy a house.", "startbuy");
manager.addDocument("en", "I wanna buy a house.", "startbuy");
manager.addDocument("en", "I want to buy a house in California.", "startbuy");
manager.addDocument("en", "How can I buy a house.", "startbuy");
manager.addDocument("en", "House.", "startbuy");
manager.addDocument("en", "I want a house", "startbuy");

manager.addDocument("en", "Which areas in  are safe to live in ?", "areaRecom");
manager.addDocument(
  "en",
  "Where is the most safe area to live in ?",
  "areaRecom"
);
manager.addDocument(
  "en",
  "Where can I buy the most safe and comfortable area to live in ?",
  "areaRecom"
);
manager.addDocument("en", "The most comfortable area to live in ", "areaRecom");

manager.addDocument("en", "1", "houseDetail");
manager.addDocument("en", "2", "houseDetail");
manager.addDocument("en", "3", "houseDetail");
manager.addDocument("en", "4", "houseDetail");
manager.addDocument("en", "5", "houseDetail");
manager.addDocument("en", "6", "houseDetail");
manager.addDocument("en", "7", "houseDetail");
manager.addDocument("en", "8", "houseDetail");
manager.addDocument("en", "9", "houseDetail");
manager.addDocument("en", "10", "houseDetail");
manager.addDocument("en", "100", "houseDetail");
manager.addDocument("en", "1000", "houseDetail");
manager.addDocument("en", "5000 USD", "houseDetail");
manager.addDocument("en", "40000 USD", "houseDetail");
manager.addDocument("en", "CA", "houseDetail");
manager.addDocument("en", "North Carolina", "houseDetail");
manager.addDocument("en", "California", "houseDetail");
manager.addDocument("en", "Washington", "houseDetail");
manager.addDocument("en", "New York", "houseDetail");
manager.addDocument("en", "Texas", "houseDetail");
manager.addDocument("en", "San Fransisco", "houseDetail");

// Train also the NLG
// manager.addAnswer("en", "toy", "Which pet do you mean?");

// Train and save the model.
(async () => {
  await manager.train();
  manager.save("./model/greet.classify.nlp");
  //   const response = await manager.process("en", "I should go now");
  //   console.log(response);
})();
