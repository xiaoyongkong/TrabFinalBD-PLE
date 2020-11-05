TYPE=VIEW
query=select `t1`.`crfFormsID` AS `crfFormsID`,`t1`.`questionID` AS `questionID`,`t1`.`questionOrder` AS `questionOrder`,`t2`.`ontologyURI` AS `form_OntologyURI`,`t3`.`ontologyURI` AS `question_OntologyURI` from ((`trab_final`.`tb_questiongroupform` `t1` join `trab_final`.`vw_crfforms_covidcrfrapid` `t2`) join `trab_final`.`vw_questions_covidcrfrapid` `t3`) where `t2`.`crfFormsID` = `t1`.`crfFormsID` and `t3`.`questionID` = `t1`.`questionID`
md5=b962cb37c50921724ee6280d618d435a
updatable=0
algorithm=0
definer_user=root
definer_host=localhost
suid=1
with_check_option=0
timestamp=2020-11-05 00:19:29
create-version=2
source=select `t1`.`crfFormsID` AS `crfFormsID`,`t1`.`questionID` AS `questionID`,`t1`.`questionOrder` AS `questionOrder`,`t2`.`ontologyURI` AS `form_OntologyURI`,`t3`.`ontologyURI` AS `question_OntologyURI` from ((`tb_questiongroupform` `t1` join `vw_crfforms_covidcrfrapid` `t2`) join `vw_questions_covidcrfrapid` `t3`) where ((`t2`.`crfFormsID` = `t1`.`crfFormsID`) and (`t3`.`questionID` = `t1`.`questionID`))
client_cs_name=utf8mb4
connection_cl_name=utf8mb4_unicode_ci
view_body_utf8=select `t1`.`crfFormsID` AS `crfFormsID`,`t1`.`questionID` AS `questionID`,`t1`.`questionOrder` AS `questionOrder`,`t2`.`ontologyURI` AS `form_OntologyURI`,`t3`.`ontologyURI` AS `question_OntologyURI` from ((`trab_final`.`tb_questiongroupform` `t1` join `trab_final`.`vw_crfforms_covidcrfrapid` `t2`) join `trab_final`.`vw_questions_covidcrfrapid` `t3`) where `t2`.`crfFormsID` = `t1`.`crfFormsID` and `t3`.`questionID` = `t1`.`questionID`
mariadb-version=100411
