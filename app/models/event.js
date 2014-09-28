// Pay - /models/event.js

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

        css: {
            type: DataTypes.TEXT
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        date: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        underscored: true
    });

    return Event;
};
