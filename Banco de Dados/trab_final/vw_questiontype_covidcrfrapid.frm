TYPE=VIEW
query=select `t1`.`questionTypeID` AS `questionTypeID`,`t1`.`description` AS `description`,`ontologyURI`(\'COVIDCRFRAPID\',\'tb_questiontype\',`t1`.`questionTypeID`) AS `ontologyURI` from `trab_final`.`tb_questiontype` `t1`
md5=351a0f80645a3444ca4f6ed6459f3a26
updatable=1
algorithm=0
definer_user=root
definer_host=localhost
suid=1
with_check_option=0
timestamp=2020-11-05 00:19:29
create-version=2
source=select `t1`.`questionTypeID` AS `questionTypeID`,`t1`.`description` AS `description`,`ontologyURI`(\'COVIDCRFRAPID\',\'tb_questiontype\',`t1`.`questionTypeID`) AS `ontologyURI` from `tb_questiontype` `t1`
client_cs_name=utf8mb4
connection_cl_name=utf8mb4_unicode_ci
view_body_utf8=select `t1`.`questionTypeID` AS `questionTypeID`,`t1`.`description` AS `description`,`ontologyURI`(\'COVIDCRFRAPID\',\'tb_questiontype\',`t1`.`questionTypeID`) AS `ontologyURI` from `trab_final`.`tb_questiontype` `t1`
mariadb-version=100411
