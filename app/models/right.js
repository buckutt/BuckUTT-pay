// Pay - /models/right.js

// Handles the Right model

'use strict';

module.exports = function (sequelize, DataTypes) {
    var Right = sequelize.define('Right', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },

        admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },

        sell: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    }, {
        underscored: true
    });

     return Right;
 };
