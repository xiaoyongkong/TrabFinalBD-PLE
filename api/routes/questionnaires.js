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

router.post('/', async function(req, res, next) {
  sql.query('INSERT INTO `tb_questionnaire` (description) VALUES (?)', [req.body.description], (err, rows, fields) => {
    if (err) throw err;
    res.send(rows);
  })
})

router.post('/delete', async function(req, res, next) {
  sql.query('DELETE FROM `tb_questionnaire` WHERE questionnaireID = ?', [req.body.id], (err, rows, fields) => {
    if (err) throw err;
    res.send(rows);
  })
})

router.post('/edit', async function(req, res, next) {
  sql.query('UPDATE `tb_questionnaire` SET description = ? WHERE questionnaireID = ?', [req.body.description, req.body.id], (err, rows, fields) => {
    if (err) throw err;
    res.send(rows);
  })
})



module.exports = router;