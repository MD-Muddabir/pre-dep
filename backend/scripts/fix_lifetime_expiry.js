/**
 * One-time fix: Clear stale subscription_end for lifetime institutes.
 * Uses Sequelize models (bypasses raw SQL table name issues).
 * Run: node scripts/fix_lifetime_expiry.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { Op } = require('sequelize');

async function fixLifetimeExpiry() {
    try {
        // Load models (this connects to DB and syncs)
        const { Institute } = require('../models');

        // Fix: Clear subscription_end and ensure active status for all lifetime members
        const [rowsAffected] = await Institute.update(
            {
                subscription_end: null,
                status: 'active'
            },
            {
                where: {
                    is_lifetime_member: true,
                    [Op.or]: [
                        { subscription_end: { [Op.not]: null } },
                        { status: { [Op.ne]: 'active' } }
                    ]
                }
            }
        );

        console.log(`✅ Fixed ${rowsAffected} lifetime institute(s). subscription_end cleared, status set to active.`);

        // Verify: Show current state of all lifetime institutes
        const lifetimeInstitutes = await Institute.findAll({
            where: { is_lifetime_member: true },
            attributes: ['id', 'name', 'status', 'subscription_end', 'is_lifetime_member', 'lifetime_purchased_at']
        });

        if (lifetimeInstitutes.length === 0) {
            console.log('ℹ️  No lifetime institutes found in the database.');
        } else {
            console.log('\n📋 Lifetime institutes after fix:');
            lifetimeInstitutes.forEach(inst => {
                console.log(`  → ID: ${inst.id} | Name: ${inst.name} | Status: ${inst.status} | Sub End: ${inst.subscription_end ?? 'NULL ✅ (correct!)'}`);
            });
        }

        console.log('\n✅ Done. Lifetime Plan expiry fix applied successfully.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error running fix:', err.message);
        console.error(err.stack);
        process.exit(1);
    }
}

fixLifetimeExpiry();
