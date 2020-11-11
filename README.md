# TrabFinalBD-PLE

Proposta - Registro de um questionário na base de dados de Apoio para Pesquisas Clínicas.

Renan Mendanha - 118055604  
Vínicius Flores -  115048056  
Xiao Yong Kong - 114176987

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
### Iniciando a API
no diretório da API, rodar os comandos:
```shell-script
$ npm i

$ npm run start
```
### Iniciando o Client
no diretório do Client, rodar os comandos:
```shell-script
$ npm i

$ npm run dev
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

# Site map e funções
### [Link para o Site map no miro](https://miro.com/welcomeonboard/ITkjHOEOlpYASwgudhrgEeCRsuP7zkUnXnyKgHi2G4kajFRGXM9vP0TJGP7i8IBk)
## Funções presentes no WebApp:
### Página inicial:
Aqui podemos navegar para as páginas de consulta de questionários, módulos e grupos de questões.
![Página inicial](Imagens/Pagina_inicial.png?raw=true)
### Questionários:
Na página de questionários é possível consultar todos os questionários existentes no banco, além de podermos executar as ações de editar a descrição de um questionário e excluí-lo(ações representadas pelos ícones na coluna "Ações" da tabela, respectivamente). Além disso, podemos criar um novo questionário do zero.
![Questionários](Imagens/Questionarios.png?raw=true)
### Grupos de questões:
Ao acessar os grupos de questões, será apresentada uma tabela com a descrição e o identificador do grupo de quesões, assim como possíveis comentários sobre o mesmo.
![Grupos de questões](Imagens/Grupos_de_questoes.png?raw=true)
### Forms:
Após selecionar um questionário, será exibida a tela de forms, nela podemos adicionar um novo form e remover ou editar um já existente.
![Forms](Imagens/Forms.png?raw=true)
# Queries

## Listar todos os questionários salvos no BD:
```SQL
SELECT * FROM tb_questionnaire
```

## Inserir Um novo questionário no BD
```SQL
INSERT INTO `tb_questionnaire` (description) VALUES (?)
```

## Remover um questionário do BD
```SQL
DELETE FROM `tb_questionnaire` WHERE questionnaireID = ?
```

## Atualizar a descrição de um questionário no BD
```SQL
UPDATE `tb_questionnaire` SET description = ? WHERE questionnaireID = ?
```

## Listar os módulos(Forms) que estão presentes em um determinado questionário:
```SQL
SELECT * FROM `tb_crfforms` WHERE questionnaireID = ?
```

## Inserir um novo Form de um questionário específico no BD 
```SQL
INSERT INTO `tb_crfforms` (description, questionnaireID) VALUES (?, ?)
```

## Remover um Form de um questionário específico no BD 
```SQL
DELETE FROM `tb_crfforms` WHERE crfFormsID = ?
```

## Atualizar a descrição do Form de um questionário específico no BD 
```SQL
UPDATE `tb_crfforms` SET description = ? WHERE crfFormsID = ?
```

## Resgatar as questões que estão dentro de um módulo CRF específico de forma ordenada:
```SQL
SELECT *, f.description as form, q.description as question, qt.description questionType, qg.description questionGroup 
FROM `tb_questiongroupform` qgf JOIN `tb_questions` q 
on qgf.questionId=q.questionId 
LEFT OUTER JOIN `tb_questionGroup` qg 
on q.questionGroupID=qg.questionGroupId 
JOIN `tb_crfforms` f 
on qgf.crfFormsId=f.crfFormsId 
JOIN tb_questiontype qt 
on q.questionTypeId=qt.questionTypeId 
where f.crfFormsId = ? 
ORDER BY qgf.questionOrder ASC 
LIMIT 10 OFFSET ?
```

## Alterações realizadas no BD
### Adicionada a chave primária 'questionaireID' na relalção 'tb_questionaire'
```SQL
ALTER TABLE `tb_questionnaire`
  ADD PRIMARY KEY (`questionnaireID`);
```
### Mudado o campo 'questionaireID' da tabela 'tb_questionaire' para Auto_Increment
Essa mudança permite designar um id automáticamente aos novos questionários adicionados à relação.
```SQL
ALTER TABLE `tb_questionnaire`
  MODIFY `questionnaireID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
```
### Mudado o campo 'crfFormsID' da tabela 'tb_crfforms' para Auto_Increment
Essa mudança permite designar um id automáticamente aos novos Formulários(módulos) adicionados à relação.
```SQL
ALTER TABLE `tb_crfforms`
  MODIFY `crfFormsID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
```
