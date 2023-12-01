const cities = require("../data/cities.json");

// Input string

const citylist = cities.cities;

// Function to extract area from the input string
exports.run = (input) => {
  const foundcitiy = [];
  for (const city of citylist) {
    if (input.includes(city)) {
      foundcitiy.push(city);
    }
  }
  return foundcitiy;
};
