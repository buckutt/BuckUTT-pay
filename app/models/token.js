/////////////////////////////
// Handles the Token model //
/////////////////////////////

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
            allowNull: true
        },

        usermail: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        reprint: {
            type: DataTypes.STRING(255),
            unique: true
        },

        mailCheck: {
            type: DataTypes.STRING(255),
            unique: true
        },

        sherlocksToken: {
            type: DataTypes.STRING(255),
            allowNull: true
        },

        reset: {
            type: DataTypes.STRING(255),
            unique: true
        }
    }, {
        underscored: true,
        paranoid: true
    });

    return Token;
};
