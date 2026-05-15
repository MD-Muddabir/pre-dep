require('dotenv').config();
const { Plan } = require('./models');
const seedPlans = require('./seeders/seedPlans');

async function run() {
    try {
        console.log("Deleting old plans...");
        await Plan.destroy({ where: {} });
        console.log("Old plans deleted. Running seeder...");
        await seedPlans();
        console.log("Success!");
        process.exit(0);
    } catch (e) {
        console.error("Error:", e);
        process.exit(1);
    }
}

run();
