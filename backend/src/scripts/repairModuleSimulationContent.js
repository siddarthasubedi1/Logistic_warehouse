require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { repairModuleSimulationContent } = require('../services/repairModuleSimulationContent');

(async () => {
    try {
        if (!process.env.MONGO_URI) throw new Error('Set MONGO_URI in backend/.env first.');
        await mongoose.connect(process.env.MONGO_URI);
        const result = await repairModuleSimulationContent();
        console.log(`Corrected ${result.repaired.length} inherited module mission(s).`);
        for (const row of result.repaired) console.log(`${row.from} -> ${row.to}: ${row.title}`);
        console.log(`Removed ${result.archived.length} misplaced warehouse mission(s). Historical results were retained.`);
    } catch (error) {
        console.error('Module content repair failed:', error.message);
        process.exitCode = 1;
    } finally { await mongoose.disconnect(); }
})();
