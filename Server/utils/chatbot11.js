const {
  findHousesById,
  updateHouseById
} = require("../controllers/user.controller");

const greetClassifier = require("./NLP/greet.classifier");

const greet = require("../utils/OpenAI/greet");
const arearecom = require("../utils/OpenAI/arearecom");
const housedetail = require("../utils/OpenAI/housedetail");
const extractnumber = require("./extrators/extractnumber");
const extractarea = require("./extrators/extractStates");

const rapid = require("./rapidapi");

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

const getHouseQ = async (query, convId) => {
  const house = await findHousesById(convId);
  try {
    switch (query.item) {
      case "location":
        try {
          const location = await housedetail.run(query.query);
          house.location = location.text.trim();
        } catch (err) {
          console.error(err);
        }
        break;
      // case "price_min":
      //   house.price_min = parseInt(extractnumber.run(query.query).numbers[0]);
      //   break;
      case "price_max":
        house.price_max = parseInt(extractnumber.run(query.query).numbers[0]);
        if (house.price_max < 1000) {
          house.price_max = initial_number;
          return {
            message: "Please input correct price range.",
            key: true,
            item: "price_max"
          };
        }
        break;
      case "beds_min":
        house.beds_min = parseInt(extractnumber.run(query.query).numbers[0]);
        break;
      // case "beds_max":
      //   house.beds_max = parseInt(extractnumber.run(query.query).numbers[0]);
      //   break;
      case "baths_min":
        house.baths_min = parseInt(extractnumber.run(query.query).numbers[0]);
        break;
      // case "baths_max":
      //   house.baths_max = parseInt(extractnumber.run(query.query).numbers[0]);
      //   break;
    }

    try {
      const res = await updateHouseById(convId, house);

      if (house.location == "") {
        return {
          message: "Which area are you interested in?",
          key: true,
          item: "location"
        };
      }
      // else if (house.price_min == initial_number) {
      //   return {
      //     message: "What is your minimum price?",
      //     key: true,
      //     item: "price_min"
      //   };
      // }
      else if (house.price_max == initial_number) {
        return {
          message: "What is your maximum price?",
          key: true,
          item: "price_max"
        };
      } else if (house.beds_min == initial_number) {
        return {
          message: "How many bedrooms do you need in minimum",
          key: true,
          item: "beds_min"
        };
      }
      // else if (house.beds_max == initial_number) {
      //   return {
      //     message: "How many bedrooms do you need in maximum",
      //     key: true,
      //     item: "beds_max"
      //   };
      // }
      else if (house.baths_min == initial_number) {
        return {
          message: "How many bathrooms do you need in minimum",
          key: true,
          item: "baths_min"
        };
      }
      // else if (house.baths_max == initial_number) {
      //   return {
      //     message: "How many bathrooms do you need in maximum",
      //     key: true,
      //     item: "baths_max"
      //   };
      // }
      else {
        try {
          const init = await updateHouseById(convId, inithouse);
          const res = await rapid.run(house);
          return {
            message: res,
            key: true,
            item: "result"
          };
        } catch (err) {
          return {
            message: "Please input correnct!",
            key: query.key,
            item: query.item
          };
        }
      }
    } catch (err) {
      return {
        message: "Please input correnct!",
        key: query.key,
        item: query.item
      };
    }
  } catch (err) {
    return {
      message: "Please input correnct!",
      key: query.key,
      item: query.item
    };
  }
};

exports.run = async (query, convId) => {
  console.log(query);
  const intent = await greetClassifier.run(query.query);
  console.log(intent);
  console.log(query.query);
  // Check if the query is in getting information process
  if (intent == "houseDetail" && query.item != "") {
    console.log("query.query", query.query);
    try {
      const res = await getHouseQ(query, convId);
      return res;
    } catch (err) {
      return {
        message: "Please input correnct!",
        key: query.key,
        item: query.item
      };
    }
  } else if (intent == "greet") {
    try {
      const res = await greet.run(query.query);
      return {
        message: res.text,
        key: false,
        item: ""
      };
    } catch (err) {
      return {
        message: "Please input correnct!",
        key: query.key,
        item: query.item
      };
    }
  } else if (intent == "areaRecom") {
    const res = await arearecom.run(query.query);
    return {
      message: res.text,
      key: true,
      item: ""
    };
  } else if (
    intent == "startbuy" &&
    extractarea.run(query.query).length === 0 &&
    query.item !== "location"
  ) {
    try {
      const res = await updateHouseById(convId, inithouse);
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
  } else {
    if (
      (extractnumber.run(query.query).numbers.length > 0 && query.item != "") ||
      (extractarea.run(query.query).length > 0 && query.item === "location")
    ) {
      try {
        const res = await getHouseQ(query, convId);
        return res;
      } catch (err) {
        return {
          message: "Please input correnct!",
          key: query.key,
          item: query.item
        };
      }
    } else {
      try {
        const res = await greet.run(query.query);
        return {
          message: res.text.trim(),
          key: false,
          item: ""
        };
      } catch (err) {
        return {
          message: "Please input correnct!",
          key: query.key,
          item: query.item
        };
      }
    }
  }
};
