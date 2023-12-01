const express = require("express");
const axios = require("axios");

const controller = require("../controllers/chat.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/chat/:convId", controller.chat);

  app.get("/api/chat/estateinfo/:zpid", controller.estateinfo);
};
