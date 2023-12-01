module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define("user", {
    name: {
      type: DataTypes.STRING
    }
    // conversations: {
    //   type: DataTypes.ARRAY(DataTypes.JSON),
    //   defaultValue: [
    //     {
    //       id: "",
    //       name: ""
    //     }
    //   ]
    // }
  });

  return User;
};
