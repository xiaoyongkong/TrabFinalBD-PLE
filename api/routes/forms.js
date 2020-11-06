var express = require('express');
var sql = require('./../sql');
var router = express.Router();

/* GET users listing. */
router.get('/groups/all', async function(req, res, next) {
  sql.query('SELECT * FROM tb_questiongroup', (err, rows, fields) => {
    if (err) throw err;
    res.send(rows);
  })
});

router.get('/crfforms/:questionnaireID', async function(req, res, next) {
  sql.query('SELECT * FROM tb_crfforms WHERE questionnaireID = ?', [req.params.questionnaireID], (err, rows, fields) => {
    if (err) throw err;
    res.send(rows);
  })
});



module.exports = router;