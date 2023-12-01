const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./user.model.js")(sequelize, Sequelize);
db.conversations = require("./conversation.model.js")(sequelize, Sequelize);
db.messages = require("./message.model.js")(sequelize, Sequelize);

db.users.hasMany(db.conversations, { as: "conversations" });
db.conversations.belongsTo(db.users, {
  foreignKey: "userId",
  as: "user"
});

db.conversations.hasMany(db.messages, { as: "messages" });
db.messages.belongsTo(db.conversations, {
  foreignKey: "conversationId",
  as: "conversation"
});

module.exports = db;
