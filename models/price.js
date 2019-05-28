"use strict";
module.exports = (sequelize, DataTypes) => {
  const Price = sequelize.define(
    "Price",
    {
      productId: DataTypes.STRING,
      price: DataTypes.DOUBLE
    },
    {}
  );
  Price.associate = function(models) {
    // associations can be defined here
  };
  return Price;
};
