const sqlite3 = require('sqlite3').verbose();
const dbFile = `${__dirname}./invitation.db`.replace('app.asar', 'app.asar.unpacked');
// console.log(dbFile);
const db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
    try {
        if (err) throw err;
        console.log('connected db')
    } catch (e) {
        console.log(e)
    }
});

module.exports = db;