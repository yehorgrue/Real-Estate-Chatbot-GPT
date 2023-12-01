module.exports = (sequelize, DataTypes) => {
  const Conversation = sequelize.define("conversation", {
    name: {
      type: DataTypes.STRING
    },
    location: {
      type: DataTypes.STRING,
      defaultValue: ""
    },
    price_min: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    price_max: {
      type: DataTypes.INTEGER,
      defaultValue: -10
    },
    beds_min: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    beds_max: {
      type: DataTypes.INTEGER,
      defaultValue: -10
    },
    baths_min: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    baths_max: {
      type: DataTypes.INTEGER,
      defaultValue: -10
    }
  });

  return Conversation;
};
