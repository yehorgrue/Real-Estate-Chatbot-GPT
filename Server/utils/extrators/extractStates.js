const states = require("../data/states.json");

// Input string

const statelist = states.states;

// Function to extract area from the input string
exports.run = (input) => {
  const foundstate = [];
  for (const state of statelist) {
    if (input.includes(state)) {
      foundstate.push(state);
    }
  }
  return foundstate;
};
