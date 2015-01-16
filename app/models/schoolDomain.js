////////////////////////////////////
// Handles the SchoolDomain model //
////////////////////////////////////

'use strict';

module.exports = function (sequelize, DataTypes) {
    var SchoolDomain = sequelize.define('SchoolDomain', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },

        domain: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        }
    }, {
        underscored: true,
        paranoid: true
    });

    return SchoolDomain;
};
