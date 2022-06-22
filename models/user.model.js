module.exports = function (sequelize, DataTypes) {
    return sequelize.define(
      "users",
      {
        id: {
          type: DataTypes.INTEGER(11),
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
        },
        user_name: {
          type: DataTypes.STRING(20),
          allowNull: true,
        },
        user_email: {
          type: DataTypes.STRING(30),
          allowNull: true,
        },
        user_mobile: {
          type: DataTypes.STRING(15),
          allowNull: true,
        }
      },
      {
        tableName: "users",
        comment:"Users Table",
      }
    );
  };
  