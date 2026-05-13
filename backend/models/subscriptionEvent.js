const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const SubscriptionEvent = sequelize.define("SubscriptionEvent", {
    institute_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    subscription_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    event_type: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
            isIn: [[
                "created",
                "upgraded",
                "downgraded",
                "renewed",
                "cancelled",
                "expired",
                "trial_started",
                "trial_ended",
                "payment_failed",
                "platform_upgrade",
                "addon_purchased",
                "addon_cancelled",
                "coupon_applied"
            ]]
        }
    },
    from_plan_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    to_plan_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    proration_credit: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    metadata: {
        type: DataTypes.JSONB,
        defaultValue: {}
    },
    performed_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: "subscription_events",
    timestamps: true
});

module.exports = SubscriptionEvent;
