const {
  findHousesById,
  updateHouseById
} = require("../controllers/user.controller");

const greetClassifier = require("./NLP/greet.classifier");

const general = require("./OpenAI/general");

const houseDetailHandler = require("./handlers/houseDetailHandler");
const extractNumber = require("./extrators/extractnumber");
const extractStates = require("./extrators/extractStates");
const extractCity = require("./extrators/extractCity");
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
  const intent = await greetClassifier.run(query.query);
  console.log("intent: ", intent);
  if (intent == "houseDetail") {
    if (query.item === "") {
      const res = await general.run(query.query);
      console.log(res);
      return {
        message: res,
        key: true,
        item: ""
      };
    } else {
      try {
        const res = await houseDetailHandler.run(query, convId);
        return res;
      } catch (err) {
        console.error(err);
        return {
          message: "Please input house details correnctly!",
          key: query.key,
          item: query.item
        };
      }
    }
  } else if (intent === "startbuy") {
    const states = extractStates.run(query.query);
    const cities = extractCity.run(query.query);
    const numbers = extractNumber.run(query.query);
    if (states.length > 0 || cities.length > 0) {
      try {
        const res = await houseDetailHandler.run(query, convId);
        return res;
      } catch (err) {
        console.error(err);
        return {
          message: "Please input house detail correnctly!",
          key: query.key,
          item: query.item
        };
      }
    } else {
      try {
        await updateHouseById(convId, inithouse);
        return {
          message:
            "Greate!, I can assist your to buy a house. Which area are you interested in?",
          key: true,
          item: "location"
        };
      } catch (err) {
        return {
          message: "Please input correnct!",
          key: query.key,
          item: query.item
        };
      }
    }
  } else if (intent === "greet") {
    try {
      const res = await general.run(query.query);
      return {
        message: res,
        key: false,
        item: ""
      };
    } catch (err) {
      return {
        message: "Please input correnctly!",
        key: query.key,
        item: query.item
      };
    }
  } else if (intent == "areaRecom") {
    try {
      const res = await arearecom.run(query.query);
      return {
        message: res.text,
        key: true,
        item: ""
      };
    } catch (err) {
      return {
        message: "Please input correnctly!",
        key: query.key,
        item: query.item
      };
    }
  } else {
    const states = extractStates.run(query.query);
    const cities = extractCity.run(query.query);
    const numbers = extractNumber.run(query.query);
    if (states.length > 0 || cities.length > 0 || numbers.length > 0) {
      try {
        const res = await houseDetailHandler.run(query, convId);
        return res;
      } catch (err) {
        console.error(err);
        return {
          message: "Please input house detail correnctly!",
          key: query.key,
          item: query.item
        };
      }
    } else {
      try {
        const res = await arearecom.run(query.query);
        return {
          message: res.text,
          key: true,
          item: ""
        };
      } catch (err) {
        return {
          message: "Please input correnctly!",
          key: query.key,
          item: query.item
        };
      }
    }
  }
};
