// Pay - /app/models/account.js

// Handles the Account model

'use strict';

module.exports = function (sequelize, DataTypes) {
    var Account = sequelize.define('Account', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },

        username: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false
        }

        // Association with Right
        // Association with Association
    }, {
        underscored: true,
        paranoid: true
    });

    return Account;
};
