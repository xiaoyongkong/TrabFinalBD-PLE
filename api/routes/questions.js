var express = require('express');
var sql = require('./../sql');
var router = express.Router();

/* GET users listing. */
router.get('/', async function(req, res, next) {
  sql.query('SELECT * FROM tb_questions', (err, rows, fields) => {
    if (err) throw err;
    res.send(rows);
  })
});

router.get('/:id', async function(req, res, next) {
  let page = 1;
  if (!!req.query.page) page = req.query.page;
  let form = 'Módulo indefinido'
  let questionnaire = 'Formulário indefinido'
  await sql.query('SELECT f.description as form, q.description as questionnaire FROM tb_crfforms f join tb_questionnaire q on f.questionnaireId=q.questionnaireId WHERE f.crfFormsId=1', [req.params.id], (err, rows, fields) => {
    if (err) throw err;
    form = rows[0].form
    questionnaire = rows[0].questionnaire
    sql.query('SELECT *, f.description as form, q.description as question, qt.description questionType FROM `tb_questiongroupform` qgf JOIN `tb_questions` q on qgf.questionId=q.questionId JOIN `tb_crfforms` f on qgf.crfFormsId=f.crfFormsId JOIN tb_questiontype qt on q.questionTypeId=qt.questionTypeId where f.crfFormsId = ? ORDER BY qgf.questionOrder ASC LIMIT 10 OFFSET ?', [req.params.id, (10 * (page - 1))], (err, rows, fields) => {
      if (err) throw err;
      res.send({ form: form, questionnaire: questionnaire, data: rows });
    })
  })

});

module.exports = router;