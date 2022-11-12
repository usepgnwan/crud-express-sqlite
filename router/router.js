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
    return await db.templateReturn(res, comment, "get all comment");
});
router.post('/insertComment', async(req, res) => {
    let data = req.body;
    let comment = await db.insertComment(data);
    return await db.templateReturn(res, comment, "insert comment success");
});

router.patch('/updateComment/:id', async(req, res) => {
    let data = req.body;
    let id = req.params.id;
    let comment = await db.UpdateComment(id, data);
    return await db.templateReturn(res, comment, "update comment success");
})


router.get('/getAllTamu', async(req, res) => {
    let tamu = await db.getAllTamu();
    return await db.templateReturn(res, tamu, "get all tamu");
});

router.post('/insertScanTamu', async(req, res) => {
    let data = req.body;
    let comment = await db.insertScanTamu(data);
    return await db.templateReturn(res, comment, "insert tamu success");
});

module.exports = { router };