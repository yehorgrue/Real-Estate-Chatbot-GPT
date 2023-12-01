const {
  findHousesById,
  updateHouseById
} = require("../../controllers/user.controller");

const extractNumber = require("../extrators/extractnumber");
const extractStates = require("../extrators/extractStates");
const extractCity = require("../extrators/extractCity");

const rapid = require("../rapidapi");

const dotenv = require("dotenv");
dotenv.config();

const initial_number = -10;
const inithouse = {
  location: "",
  price_min: 0,
  price_max: initial_number,
  baths_min: initial_number,
  baths_max: 100,
  beds_min: initial_number,
  beds_max: 100
};

const nonereturn = {
  message: "Please input correnct!",
  key: false,
  item: ""
};

exports.run = async (query, convId) => {
  let numbers = [];
  try {
    const house = await findHousesById(convId);
    switch (query.item) {
      case "location":
        const states = extractStates.run(query.query);
        const cities = extractCity.run(query.query);
        if (states.length > 0) {
          if (cities.length > 0) {
            house.location = cities[0] + ", " + states[0];
          } else {
            house.location = states[0];
          }
        } else {
          if (cities.length > 0) {
            house.location = cities[0];
          }
        }
        break;
      case "price_max":
        numbers = extractNumber.run(query.query);
        if (numbers.length === 1) {
          house.price_max = parseInt(numbers[0]);
        } else {
          return {
            message: "Please input correct maximum price of the house.",
            key: true,
            item: "price_max"
          };
        }
        break;
      case "beds_min":
        numbers = extractNumber.run(query.query);
        house.beds_min = parseInt(numbers[0]);
        break;
      case "baths_min":
        numbers = extractNumber.run(query.query);
        house.baths_min = parseInt(numbers[0]);
        break;
    }

    try {
      await updateHouseById(convId, house);
      if (house.location == "") {
        return {
          message: "Which area are you most interested in?",
          key: true,
          item: "location"
        };
      } else if (house.price_max == initial_number) {
        return {
          message: "What is your maximum price to buy a house?",
          key: true,
          item: "price_max"
        };
      } else if (house.beds_min == initial_number) {
        return {
          message: "How many bedrooms do you need minimum",
          key: true,
          item: "beds_min"
        };
      } else if (house.baths_min == initial_number) {
        return {
          message: "How many bathrooms do you need in minimum",
          key: true,
          item: "baths_min"
        };
      } else {
        try {
          await updateHouseById(convId, inithouse);
          try {
            const res = await rapid.run(house);
            return {
              message: res,
              key: true,
              item: "result"
            };
          } catch (err) {
            throw err;
          }
        } catch (err) {
          console.error(err);
          return {
            message: "I cannot understand. Please input correctly!",
            key: false,
            item: ""
          };
        }
      }
    } catch (err) {
      console.error(err);
      return {
        message: "I cannot understand. Please input correctly!",
        key: false,
        item: ""
      };
    }
  } catch (err) {
    console.error(err);
    return {
      message: "I cannot understand. Please input correctly!",
      key: false,
      item: ""
    };
  }
};
