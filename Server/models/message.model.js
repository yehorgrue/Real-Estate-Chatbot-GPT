module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define("message", {
    key: {
      type: DataTypes.BOOLEAN
    },
    content: {
      type: DataTypes.JSON
    }
  });

  return Message;
};
