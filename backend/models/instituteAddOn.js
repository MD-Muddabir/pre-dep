const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const InstituteAddOn = sequelize.define("InstituteAddOn", {
    institute_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    add_on_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    status: {
        type: DataTypes.STRING(20),
        validate: { isIn: [["active", "expired", "cancelled"]] },
        defaultValue: "active"
    },
    start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    end_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    auto_renew: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    amount_paid: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    razorpay_order_id: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    tableName: "institute_add_ons",
    timestamps: true
});

module.exports = InstituteAddOn;
