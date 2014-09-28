// Pay - /app/models/association.js

// Handles the Association model

'use strict';

module.exports = function (sequelize, DataTypes) {
    var Association = sequelize.define('Association', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        }
    }, {
        underscored: true
    });

    return Association;
};
