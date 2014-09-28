// Pay - /app/models/price.js

// Handles the Price model

'use strict';

module.exports = function (sequelize, DataTypes) {
    var Price = sequelize.define('Price', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        price: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false
        }
    }, {
        underscored: true
    });

    return Price;
};
