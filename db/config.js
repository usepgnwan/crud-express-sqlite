// const sqlite3 = require('sqlite3').verbose();
// const dbFile = `${__dirname}./invitation.db`.replace('app.asar', 'app.asar.unpacked');
// // console.log(dbFile);
// const db = new sqlite3.Database(dbFile, sqlite3.OPEN_READWRITE, (err) => {
//     try {
//         if (err) throw err;
//         console.log('connected db')
//     } catch (e) {
//         console.log(e)
//     }
// });

// module.exports = db;

const fs = require("fs");

// Initialize the database
const dbFile = "./db/invitation.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
let db;

dbWrapper
    .open({
        filename: dbFile,
        driver: sqlite3.Database
    })
    .then(async dBase => {
        db = dBase;
        try {
            // The async / await syntax lets us write the db operations in a way that won't block the app
            if (!exists) {
                // Database doesn't exist yet - create Choices and Log tables
                await db.run(
                    `CREATE  TABLE IF NOT EXISTS comment (  
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        id_comment_bls INTEGER NULL,
                        nama TEXT,
                        comment TEXT,
                        kehadiarn VARCHAR(64),
                        status VARCHAR(64) 
                        ) `
                );
                // addd records
                await db.run(
                    "INSERT INTO comment (id_comment_bls,nama, comment,kehadiarn,status) VALUES (0,'test', 'selamat ya', 'hadir', 1)"
                );
            } else {
                console.log(await db.all("SELECT * FROM comment"));
            }
            console.log("connected to db")
        } catch (dbError) {
            console.error(dbError);
        }
    });

module.exports = {
    getAllComment: async() => {
        try {
            return await db.all("SELECT * FROM comment");
        } catch (dbError) {
            // Database connection error
            console.error(dbError);
            return 0;
        }
    },
}