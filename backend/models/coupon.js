const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Coupon = sequelize.define("Coupon", {
    code: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    discount_type: {
        type: DataTypes.STRING(20),
        validate: { isIn: [["percentage", "fixed"]] },
        defaultValue: "percentage"
    },
    discount_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    min_plan_price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    max_uses: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    uses_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    valid_from: {
        type: DataTypes.DATE,
        allowNull: true
    },
    valid_until: {
        type: DataTypes.DATE,
        allowNull: true
    },
    applicable_plans: {
        type: DataTypes.JSONB,
        defaultValue: []
    },
    applicable_platforms: {
        type: DataTypes.JSONB,
        defaultValue: []
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: "coupons",
    timestamps: true
});

module.exports = Coupon;
