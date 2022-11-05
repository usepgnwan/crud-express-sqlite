const express = require('express');
const db = require('../db/config.js')
const router = express.Router();

router.get('/create_table', function(req, res) {
    let sql = `CREATE  TABLE IF NOT EXISTS comment (  
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nama TEXT,
                    comment TEXT,
                    kehadiarn VARCHAR(64),
                    status VARCHAR(64) 
                    ) `;
    db.run(sql, (err, result) => {
        try {
            if (err) throw err;
            res.status(200).send({ "succes": true, "msg": "succes bikin tabel baru" });
            db.close();
        } catch (e) {
            res.status(500).send({ "succes": false, "msg": "Internal Server Error" });
        }
    });

});

router.get('/', (req, res) => {
    res.send("ok sukses");
});


module.exports = { router };