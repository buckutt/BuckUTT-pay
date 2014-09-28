// Pay - /app/models/meanOfPayment.js

// Handles the MeanOfPayment model

'use strict';

module.exports = function (sequelize, DataTypes) {
    var MeanOfPayment = sequelize.define('MeanOfPayment', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    }, {
        underscored: true
    });

    return MeanOfPayment;
};
