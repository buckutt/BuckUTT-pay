// Pay - /app/models/event.js

// Handles the Event model

'use strict';

module.exports = function (sequelize, DataTypes) {
    var Event = sequelize.define('Event', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },

        picture: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        date: {
            type: DataTypes.DATE,
            allowNull: false
        },

        maximumTickets: {
            type: DataTypes.INTEGER(5).UNSIGNED
        },

        opened: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },

        bdeCard: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        fundationId: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false
        },

        backendId: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false
        }
    }, {
        underscored: true,
        paranoid: true
    });

    return Event;
};
