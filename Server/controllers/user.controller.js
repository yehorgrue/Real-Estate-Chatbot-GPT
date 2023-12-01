const express = require("express");
const db = require("../models");
const User = db.users;
const Conversation = db.conversations;
const Message = db.messages;

exports.createUser = (req, res) => {
  User.create(req.body)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.createConversation = (req, res) => {
  const conversation = req.body;
  const userId = req.params.userId;
  Conversation.create({
    name: conversation.name,
    userId: userId
  })
    .then((conv) => {
      Message.create({
        key: false,
        content: conversation.initialmessage,
        conversationId: conv.id
      })
        .then((data) => {
          res.send(conv);
        })
        .catch((err) => {
          res.status(500).send(err);
        });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.deleteConversation = (req, res) => {
  const convId = req.params.convId;
  Conversation.destroy({
    where: { id: convId }
  })
    .then((data) => {
      res.send({ data });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.findUserById = (req, res) => {
  id = req.params.id;
  User.findByPk(id, { include: ["conversations"] })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.findConversationById = (req, res) => {
  id = req.params.id;
  Conversation.findByPk(id, { include: ["messages"] })
    .then((conversation) => {
      res.send(conversation);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
};

exports.createMessage = async (convId, key, content) => {
  try {
    const message = await Message.create({
      key: key,
      content: content,
      conversationId: convId
    });
    return message;
  } catch (err) {
    throw err;
  }
};

exports.findHousesById = async (convId) => {
  try {
    const conversation = await Conversation.findByPk(convId);
    return {
      location: conversation.location,
      price_min: conversation.price_min,
      price_max: conversation.price_max,
      beds_min: conversation.beds_min,
      beds_max: conversation.beds_max,
      baths_min: conversation.baths_min,
      baths_max: conversation.baths_max
    };
  } catch (err) {
    throw err;
  }
};

exports.updateHouseById = async (convId, newhouse) => {
  try {
    const id = await Conversation.update(newhouse, {
      where: { id: convId }
    });
    return {
      message: id
    };
  } catch (err) {
    return {
      message: err
    };
  }
};

exports.findAll = () => {
  return User.findAll({
    include: ["conversations"]
  }).then((users) => {
    return users;
  });
};
