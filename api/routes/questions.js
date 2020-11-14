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

router.get('/types', async function(req, res, next) {
  sql.query('SELECT * FROM `tb_questiontype`', (err, rows, fields) => {
    if (err) throw err;
    res.send(rows)
  })
})

router.get('/groups', async function(req, res, next) {
  sql.query('SELECT * FROM `tb_questiongroup`', (err, rows, fields) => {
    if (err) throw err;
    res.send(rows)
  })
})

router.post('/edit/:id', async function(req, res, next) {
  if (req.body.questionTypeID == null) res.send('No question type defined')
  else {
    sql.query('SELECT * FROM `tb_questions` q JOIN `tb_questiongroupform` qgf on qgf.questionID=q.questionID JOIN `tb_crfforms` crf on crf.crfFormsID=qgf.crfFormsID where q.questionID=?', [req.params.id], (err, rows, fields) => {
      if (err) throw err;
      let questionnaireId = rows[0].questionnaireId
      let crfFormsId = rows[0].crfFormsID
      let questionGroupID_before = rows[0].questionGroupID

      sql.query('SELECT qgf.questionOrder, q.questionGroupID from `tb_questions` q JOIN `tb_questiongroupform` qgf on qgf.questionID=q.questionID where q.questionGroupID=? and qgf.crfFormsID=? LIMIT 1', [req.body.questionGroupID, crfFormsId], (err, rows2, fields) => {
        if (err) throw err;
        let questionOrder_before_groupIndex = null
        if (!!rows2 && rows2.length)
          questionOrder_before_groupIndex = parseInt(rows2[0].questionOrder.toString().charAt(2))

        console.log(questionGroupID_before, req.body.questionGroupID)

        if (questionGroupID_before == req.body.questionGroupID)
          sql.query('UPDATE `tb_questions` SET description=?, questionTypeID=? where questionID=?', [req.body.description, req.body.questionTypeID, req.params.id], (err, rows3, fields) => {
            res.send(rows3)
          })
        else {
          let dynamic_statement = '='
          if (req.body.questionGroupID == null)
            dynamic_statement = 'is'
          sql.query('SELECT MAX(qgf.questionOrder) as questionOrder from `tb_questions` q JOIN `tb_questiongroupform` qgf on q.questionID=qgf.questionID where q.questionGroupID ' + dynamic_statement + ' ? and qgf.crfFormsID = ? ', [req.body.questionGroupID, crfFormsId], async(err, rows3, fields) => {
            if (err) throw err;
            let questionOrder = null
            if (rows3[0].questionOrder) {
              questionOrder = rows3[0].questionOrder + 1

              console.log(questionOrder)

              sql.beginTransaction(err => {
                if (err) throw err;
                sql.query('UPDATE `tb_questions` SET description=?, questionTypeID=?, questionGroupID=? where questionID=?;', [req.body.description, req.body.questionTypeID, req.body.questionGroupID, parseInt(req.params.id)], (err, result) => {
                  if (err) {
                    sql.rollback(() => {
                      throw err
                    })
                  }
                })
                sql.query('UPDATE `tb_questiongroupform` SET questionOrder=? where questionID=?;', [questionOrder, parseInt(req.params.id)], (err, result) => {
                  if (err) {
                    sql.rollback(() => {
                      throw err
                    })
                  }
                })
                sql.commit(err => {
                  if (err) {
                    sql.rollback(() => {
                      throw err
                    })
                  }
                  res.send('Success')
                })

              })

            } else {
              sql.query('SELECT MAX(qgf.questionOrder) as questionOrder from `tb_questions` q JOIN `tb_questiongroupform` qgf on q.questionID=qgf.questionID where qgf.crfFormsID=?', [crfFormsId], (err, result) => {
                questionOrder = parseInt((result[0].questionOrder + 100).toString().slice(0, -2) + '00')
                sql.beginTransaction(err => {
                  if (err) throw err;
                  sql.query('UPDATE `tb_questions` SET description=?, questionTypeID=?, questionGroupID=? where questionID=?;', [req.body.description, req.body.questionTypeID, req.body.questionGroupID, parseInt(req.params.id)], (err, result) => {
                    if (err) {
                      sql.rollback(() => {
                        throw err
                      })
                    }
                  })
                  console.log('QUESTION ORDER', questionOrder)
                  sql.query('UPDATE `tb_questiongroupform` SET questionOrder=? where questionID=?;', [questionOrder, parseInt(req.params.id)], (err, result) => {
                    if (err) {
                      sql.rollback(() => {
                        throw err
                      })
                    }
                  })
                  sql.commit(err => {
                    if (err) {
                      sql.rollback(() => {
                        throw err
                      })
                    }
                    res.send('Success')
                  })

                })
              })
            }


          })
        }

      })
    })
  }

})

router.get('/:id', async function(req, res, next) {
  let page = 1;
  if (!!req.query.page) page = req.query.page;
  let form = 'Módulo indefinido'
  let questionnaire = 'Formulário indefinido'
  sql.query('SELECT f.description as form, q.description as questionnaire FROM tb_crfforms f join tb_questionnaire q on f.questionnaireId=q.questionnaireId WHERE f.crfFormsId=?', [req.params.id], (err, rows, fields) => {
    if (err) throw err;
    form = rows[0].form
    questionnaire = rows[0].questionnaire
    sql.query('SELECT *, f.description as form, q.description as question, qt.description questionType, qg.description questionGroup FROM `tb_questiongroupform` qgf JOIN `tb_questions` q on qgf.questionId=q.questionId LEFT OUTER JOIN `tb_questionGroup` qg on q.questionGroupID=qg.questionGroupId JOIN `tb_crfforms` f on qgf.crfFormsId=f.crfFormsId JOIN tb_questiontype qt on q.questionTypeId=qt.questionTypeId where f.crfFormsId = ? ORDER BY qgf.questionOrder ASC LIMIT 10 OFFSET ?', [req.params.id, (10 * (page - 1))], (err, rows, fields) => {
      if (err) throw err;
      res.send({ form: form, questionnaire: questionnaire, data: rows });
    })
  })

});

module.exports = router;