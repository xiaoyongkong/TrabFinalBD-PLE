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

router.post('/crfforms/', async function(req, res, next) {
  sql.query('INSERT INTO `tb_crfforms` (description, questionnaireID) VALUES (?, ?)', [req.body.description, req.body.questionnaireID], (err, rows, fields) => {
    if (err) throw err;
    res.send(rows);
  })
});

router.post('/crfforms/delete', async function(req, res, next) {
  sql.query('DELETE FROM `tb_crfforms` WHERE crfFormsID = ?', [req.body.id], (err, rows, fields) => {
    if (err) throw err;
    res.send(rows);
  })
})

router.post('/crfforms/edit', async function(req, res, next) {
  sql.query('UPDATE `tb_crfforms` SET description = ? WHERE crfFormsID = ?', [req.body.description, req.body.id], (err, rows, fields) => {
    if (err) throw err;
    res.send(rows);
  })
})



module.exports = router;