//////////////////////////////
// Handles the Ticket model //
//////////////////////////////

'use strict';

module.exports = function (sequelize, DataTypes) {
    var Ticket = sequelize.define('Ticket', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },

        username: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false
        },

        displayName: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        birthdate: {
            type: DataTypes.STRING(10),
            allowNull: true
        },

        mail: {
            type: DataTypes.STRING,
            allowNull: false
        },

        student: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        contributor: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        paid: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        paid_at: {
            type: DataTypes.DATE,
        },

        paid_with: {
            type: DataTypes.STRING(45)
        },

        validatedDate: {
            type: DataTypes.DATE,
            allowNull: true
        },

        temporarlyOut: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },

        barcode: {
            type: DataTypes.STRING(13),
            allowNull: false,
            unique: true
        },

        bdeCard: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: true,
            unique: false
        },

        mainTicket: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            defaultValue: 0
        }

        // Association with Price
        // Association with Event
    }, {
        underscored: true,
        paranoid: true
    });

    return Ticket;
};
