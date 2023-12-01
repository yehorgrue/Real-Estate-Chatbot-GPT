const express = require("express");
const axios = require("axios");

const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/user/createUser", controller.createUser);

  app.post(
    "/api/user/createConversation/:userId",
    controller.createConversation
  );
  app.delete(
    "/api/user/deleteConversation/:convId",
    controller.deleteConversation
  );
  // app.post("/api/user/createMessage/:convId", controller.createMessage);

  app.get("/api/user/findUser/:id", controller.findUserById);

  app.get(
    "/api/user/findConversationById/:id",
    controller.findConversationById
  );

  // app.get("/api/user/findHousesById/:convId", controller.findHousesById);

  // app.put("/api/user/updateHouseById/:convId", controller.updateHouseById);
};
