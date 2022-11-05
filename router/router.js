const express = require('express');
const data = require("../db/data.json");
const db = require("../db/" + data.database);
const router = express.Router();

// router.get('/create_table', function(req, res) {
//     let sql = `CREATE  TABLE IF NOT EXISTS comment (  
//                     id INTEGER PRIMARY KEY AUTOINCREMENT,
//                     nama TEXT,
//                     comment TEXT,
//                     kehadiarn VARCHAR(64),
//                     status VARCHAR(64) 
//                     ) `;
//     db.run(sql, (err, result) => {
//         try {
//             if (err) throw err;
//             res.status(200).send({ "succes": true, "msg": "succes bikin tabel baru" });
//             db.close();
//         } catch (e) {
//             res.status(500).send({ "succes": false, "msg": "Internal Server Error" });
//         }
//     });

// });

// router.get('/create_table', function(req, res) {});
router.get('/', (req, res) => {
    res.send("now you connecting to here!!");
});

router.get('/allcomment', async(req, res) => {
    let comment = await db.getAllComment();
    console.log(comment)
    let rows = {};
    let code = 0;
    if (Array.isArray(comment)) {
        rows.status = true;
        rows.msg = "succes get all comment";
        rows.data = comment;
        code = 200;
    } else {
        rows.status = false;
        rows.msg = data.errorMessage;
        rows.data = [];
        code = 500;
    }
    return res.status(code).send(rows);
});


module.exports = { router };