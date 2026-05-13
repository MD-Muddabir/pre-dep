const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AddOn = sequelize.define("AddOn", {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    price_monthly: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    price_yearly: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    price_one_time: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    unit_label: {
        type: DataTypes.STRING(50)
    },
    category: {
        type: DataTypes.STRING(30),
        validate: {
            isIn: [["platform", "students", "faculty", "messaging", "storage", "features", "support"]]
        }
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    display_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: "add_ons",
    timestamps: true
});

module.exports = AddOn;
