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

const { json } = require("express");
const fs = require("fs");

// Initialize the database
const dbFile = "./db/invitations.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const dbWrapper = require("sqlite");
const data = require("../db/data.json");
let tgl = new Date().toLocaleString("id-ID");
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
                        kehadiran VARCHAR(64),
                        status VARCHAR(64),
                        tanggal text
                        ) `
                );
                await db.run(
                    `CREATE  TABLE IF NOT EXISTS scan_tamu (  
                            id INTEGER PRIMARY KEY AUTOINCREMENT, 
                            nama TEXT, 
                            tanggal text,
                            jam text
                        )`
                );
                // addd records
                await db.run(
                    "INSERT INTO comment (id_comment_bls,nama, comment,kehadiran,status,tanggal) VALUES (0,'Invitation', 'selamat ya, berbahagia selalu...', 'hadir', 1,'" + tgl + "')"
                );
                await db.run(
                    "INSERT INTO scan_tamu (nama,tanggal,jam) VALUES ('usep','2022/12/01','08:00')"
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
    templateReturn: async(res, row, msg) => {
        let rows = {};
        let code = 0;
        if (typeof row == 'object') {
            rows.status = true;
            rows.msg = msg;
            rows.data = row;
            code = 200;
        } else {
            rows.status = false;
            rows.msg = data.errorMessage;
            rows.data = {};
            code = 500;
        }
        return res.status(code).send(rows);
    },
    getAllComment: async() => {
        try {
            let comment = await db.all("SELECT * FROM comment");
            let new_comment = {}
            console.log(comment[1]);
            comment.forEach((val, i) => {
                if (val.id_comment_bls != 0) {
                    new_comment[val.id_comment_bls] = val;
                }
            });
            let all_coment = {};
            comment.forEach((val, i) => {
                if (val.id_comment_bls == 0) {
                    comment[i]["balesan"] = typeof new_comment[val.id] != "undefined" ? new_comment[val.id] : {};
                    all_coment[i] = val;
                }
            });
            // all_coment = Object.entries(all_coment);
            return all_coment;

        } catch (dbError) {
            // Database connection error
            console.error(dbError);
            return 0;
        }
    },
    insertComment: async(data) => {

        if (Object.keys(data).length > 0) {
            let { id_comment_bls, nama, comment, kehadiran, status } = data;

            let ins = await db.run("INSERT INTO comment (id_comment_bls, nama, comment, kehadiran, status,tanggal) VALUES (?,?,?,?,?,?)", [
                id_comment_bls, nama, comment, kehadiran, status, tgl
            ]);
            // ins = JSON.stringify(ins);
            // console.log(ins.lastID)
            return await db.get("SELECT * FROM comment where id = ? ", [ins.lastID]);
        } else {
            return 0;
        }
    },
    UpdateComment: async(id, data) => {
        try {
            let sql = "UPDATE comment SET  ";
            sql += Object.keys(data).map((key) => {
                let valueSet;
                if (key == 'id_comment_bls' || key == 'status') {
                    valueSet = data[key];
                } else {
                    valueSet = typeof data[key] == 'string' ? `'${data[key]}'` : data[key];
                }

                return `${key}=${valueSet}`;
            }).join(', ');
            sql += " WHERE id=?";
            update = await db.run(sql, id);
            return await db.get("SELECT * FROM comment where id = ? ", [id]);
        } catch (e) {
            return 0;
        }
    },
    getAllTamu: async() => {
        try {
            let tamu = await db.all("SELECT * FROM scan_tamu");
            // all_coment = Object.entries(all_coment);
            return tamu;

        } catch (dbError) {
            // Database connection error
            console.error(dbError);
            return 0;
        }
    },
    insertScanTamu: async(data) => {
        if (Object.keys(data).length > 0) {
            tgl = tgl.split(" ");
            let { nama } = data;
            let ins = await db.run("INSERT INTO scan_tamu (nama,tanggal,jam) VALUES (?,?,?)", [
                nama, tgl[0], tgl[1]
            ]);
            return await db.get("SELECT * FROM scan_tamu where id = ? ", [ins.lastID]);
        } else {
            return 0;
        }
    },
}