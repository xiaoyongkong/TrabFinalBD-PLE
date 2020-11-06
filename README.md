# TrabFinalBD-PLE
# Dependências e versões sendo utilizadas
### MySql
O sistema da base de dados utiliza o MySql
### Node.js e npm
Será necessário instalar a última versão do Node.js e npm(6.14) que podem ser obtidos nesse [Link](https://nodejs.org/en/download/).
para instalar as dependencias no npm, devemos seguir os seguites procedimentos:

```shell-script
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

# Funções presentes no app:
- Cadastrar um questionário
- Atualizar um questionário
- Excluir um questionário
- Consultar um questionário
- Carregar um exemplo de outro formulário

## Ao cadastrar e atualizar, a inserção das questões deve seguir a seguinte ordem:
- Módulos(Etapas de um questionário)
- Agrupamentos(questões que tratam de um mesmo tema/ área de conhecimento)
- Questões*
*Ao obter as questões, devemos verificar o tipo da questão e se ela possui alguma resposta padronizada.

# Querrys

## Listar todos os questionários salvos no BD:
```SQL
SELECT * FROM tb_questionnaire
```

## Listar os módulos(Forms) que estão presentes em um determinado questionário:
```SQL
SELECT * FROM tb_questionnaire WHERE questionnaireID = ?
```

## Resgatar as questões que estão dentro de um módulo CRF específico de forma ordenada:
```SQL
SELECT tb_questions.description 
FROM tb_questions,tb_questiongroupform 
WHERE tb_questiongroupform.crfFormsID = ? 
AND tb_questiongroupform.questionID = tb_questions.questionID 
ORDER BY tb_questiongroupform.questionOrder ASC
```
