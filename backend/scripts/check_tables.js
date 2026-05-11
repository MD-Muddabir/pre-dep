require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const sequelize = require('../config/database');
const { Op } = require('sequelize');

async function checkTables() {
    await sequelize.authenticate();
    const [rows] = await sequelize.query(
        "SELECT table_name FROM information_schema.tables WHERE table_schema NOT IN ('pg_catalog', 'information_schema') ORDER BY table_name"
    );
    console.log('All tables:', rows.map(r => r.table_name || r.TABLE_NAME).join(', '));
    await sequelize.close();
    process.exit(0);
}
checkTables().catch(e => { console.error(e.message); process.exit(1); });
