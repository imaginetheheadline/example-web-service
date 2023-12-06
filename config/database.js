const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL);

const db = mongoose.connection;
db.on('connected', () => {
    console.info(`Mongoose connected to ${db.host}, using ${db.name}`);
});