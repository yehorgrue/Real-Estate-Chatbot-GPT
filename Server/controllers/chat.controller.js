const chatbot = require("../utils/chatbot.js");
const { createMessage } = require("./user.controller.js");
const estateinfo = require("../utils/estateinfo.js");

const zillow_url = "https://www.zillow.com";

exports.chat = async (req, res) => {
  convId = req.params.convId;
  query = req.body;
  try {
    await createMessage(convId, true, query);
  } catch (err) {
    console.error(err);
    throw err;
  }
  try {
    const result = await chatbot.run(query, convId);
    if (result !== null) {
      try {
        await createMessage(convId, false, result);
      } catch (err) {
        console.error(err);
        throw err;
      }
    }
    res.status(200).send({
      result: result
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      result: err
    });
  }
};

exports.estateinfo = async (req, res) => {
  zpid = req.params.zpid;
  console.log(zpid);
  estateinfo
    .run(zpid)
    .then((data) => {
      if (data.success) {
        console.log(data.property.hdpUrl);

        res.status(200).send({
          data: zillow_url + data.property.hdpUrl
        });
      }
    })
    .catch((err) => {
      // throw err;
      res.status(500).send(err);
    });
  // res.send("Ok");
};
