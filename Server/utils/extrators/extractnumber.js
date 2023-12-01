const fs = require("fs");

exports.run = (text) => {
  const numberPattern = /\d+(\.\d+)?/g;
  const numbers = [];

  let match;

  while ((match = numberPattern.exec(text)) !== null) {
    numbers.push(match[0]);
  }
  return numbers;
};
