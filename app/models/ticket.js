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
        }

        // Association with Price
        // Association with Event
        // Association with Mean of Payment
    }, {
        underscored: true,
        paranoid: true
    });

    return Ticket;
};
