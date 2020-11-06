var express = require('express');
var sql = require('./../sql');
var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
  sql.query('SELECT * FROM tb_questionnaire', (err, rows, fields) => {
    if (err) throw err;
    res.send(rows);
  })
});

router.get('/:id', async function(req, res, next) {
  sql.query('SELECT * FROM tb_questionnaire WHERE questionnaireID = ?', [req.params.id], (err, rows, fields) => {
    if (err) throw err;
    res.send(rows);
  })
});

module.exports = router;