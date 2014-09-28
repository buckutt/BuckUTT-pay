// Pay - /models/token.js

// Handles the Token model

'use strict';

module.exports = function (sequelize, DataTypes) {
    var Token = sequelize.define('Token', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },

        ticket: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            unique: true
        },

        remove: {
            type: DataTypes.STRING(255),
            unique: true
        },

        reprint: {
            type: DataTypes.STRING(255),
            unique: true
        },

        schoolValidation: {
            type: DataTypes.STRING(255),
            unique: true
        }
    }, {
        underscored: true
    });

    return Token;
};
