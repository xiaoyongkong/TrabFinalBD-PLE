# Projeto Vodan - PLE

Proposta - Registro de um questionário na base de dados de Apoio para Pesquisas Clínicas.

Renan Mendanha - 118055604  
Vínicius Flores -  115048056  
Xiao Yong Kong - 114176987

# Ferramentas Utilizadas
-	Miro: Para criar o Site Map e elucidar as funções a serem implementadas;
-	mySQL 5.7.22: implementação das consultas e queries, integração com interface
-	Vue.js: como framewwork front-end;
-	Nuxt: framework SSR (Server Side Rendering) utilizada junto com o Vue.js para facilitar a utilização de componentes de interface de forma que os dados ficassem dispostos de maneira mais organizada;
-	Express: api para lidar com as requisições e conexão com o banco de dados;
-	Telegram: comunicação rápida, código, e agendamento de reuniões;
-	Github: compartilhamento de scripts e códigos remotamente;
-	Discord: Ferramenta para conferências de áudio e vídeo que foi utilizada para os encontros do grupo.

# Dependências e versões sendo utilizadas
### MySql
O sistema da base de dados utiliza o MySql 5.7.22
### Node.js e npm
Será necessário instalar a última versão do Node.js e npm(6.14) que podem ser obtidos [nesse Link](https://nodejs.org/en/download/) para executar os frameworks utilizados:
-	Vue.js: como framewwork front-end;
-	Nuxt: framework SSR (Server Side Rendering) utilizada junto com o Vue.js para facilitar a utilização de componentes de interface de forma que os dados ficassem dispostos de maneira mais organizada;
-	Express: api para lidar com as requisições e conexão com o banco de dados;

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
## Questionários
### Listar todos os questionários salvos no BD:
```SQL
SELECT * FROM tb_questionnaire
```

### Inserir Um novo questionário no BD
```SQL
INSERT INTO `tb_questionnaire` (description) VALUES (?)
```

### Remover um questionário do BD
```SQL
DELETE FROM `tb_questionnaire` WHERE questionnaireID = ?
```

### Atualizar a descrição de um questionário no BD
```SQL
UPDATE `tb_questionnaire` SET description = ? WHERE questionnaireID = ?
```

## Forms
### Listar os módulos(Forms) que estão presentes em um determinado questionário:
```SQL
SELECT * FROM `tb_crfforms` WHERE questionnaireID = ?
```

### Inserir um novo Form em um questionário específico no BD 
```SQL
INSERT INTO `tb_crfforms` (description, questionnaireID) VALUES (?, ?)
```

### Remover um Form de um questionário específico no BD 
```SQL
DELETE FROM `tb_crfforms` WHERE crfFormsID = ?
```

### Atualizar a descrição do Form de um questionário específico no BD 
```SQL
UPDATE `tb_crfforms` SET description = ? WHERE crfFormsID = ?
```

## Questões
### Resgatar as questões que estão dentro de um módulo CRF específico de forma ordenada:
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

### Seleção de uma questão específica em um Form
```SQL
SELECT * FROM `tb_questions` q 
JOIN `tb_questiongroupform` qgf on qgf.questionID=q.questionID 
JOIN `tb_crfforms` crf on crf.crfFormsID=qgf.crfFormsID 
where q.questionID=?
```

### Seleção da ordem das questões em um grupamento de questões específico em um Form
```SQL
SELECT qgf.questionOrder, q.questionGroupID 
FROM `tb_questions` q 
JOIN `tb_questiongroupform` qgf on qgf.questionID=q.questionID 
where q.questionGroupID=? 
and qgf.crfFormsID=? 
LIMIT 1
```

### Remoção de uma questão
```SQL
DELETE FROM `tb_questions` where questionID = ?
```

## Editar uma questão
### Atualizar a descrição de uma questão em um form
Para verificar se a ação está somente mudando a descrição de uma questão, o grupo da questão e o ID não deve ser alterado, por isso há a verificação do novo grupo da questão, se ele for igual, a querry muda somente a descrição. 
```JavaScript
if (questionGroupID_before == req.body.questionGroupID)
```
Se este for o caso, executamos a seguinte querry:
```SQL
UPDATE `tb_questions` SET description=?, questionTypeID=? where questionID=?
```

### Selecionar o valor da ordem da última questão de um grupamento em um form
Se há mudança no grupamento da questão, executaremos a querry que será apresentada a seguir para adicionar corretamente uma ordem à nova questão(a consulta pode não retornar resultados se não existir nenhuma questão em um determinado grupamento, caso isso aconteça, a ordem dentro do grupamento será 0, caso contrário, será o maior valor de ordem somando-se 1), mas antes, devemos verificar se estamos tratando de uma questão genérica, caso seja uma questão genérica não possuirá grupo e, por conseguência, terá o 'questionGroupID' nulo. Se tivermos uma verificação de nulo, devemos utilizar a declaração lógica 'is'ao invéz de '='. 
```JavaScript
let dynamic_statement = '='
if (req.body.questionGroupID == null)
  dynamic_statement = 'is'
```
Executamos a seguinte querry, inserindo a variável que define o tipo de comparação:
```SQL
'SELECT MAX(qgf.questionOrder) as questionOrder 
from `tb_questions` q 
JOIN `tb_questiongroupform` qgf on q.questionID=qgf.questionID 
where q.questionGroupID ' + dynamic_statement + ' ? and qgf.crfFormsID = ?'
```

### Editar completamente uma questão em um Form
Primeiramente, alteramos as informações da questão propriamente dita:
```SQL
UPDATE `tb_questions` SET description=?, questionTypeID=?, questionGroupID=? where questionID=?
```
Precisamos agora atualizar a ordem da questão no novo grupamento de questões, levando em conta sua última ordem, assim como supracitado:
```SQL
UPDATE `tb_questiongroupform` SET questionOrder=? where questionID=?
```

## Adicionar uma nova questão
### Selecionar o valor da ordem da última questão de um grupamento em um form
Se há uma adição no grupamento da questão, executaremos a querry que será apresentada a seguir para adicionar corretamente uma ordem à nova questão(a consulta pode não retornar resultados se não existir nenhuma questão em um determinado grupamento, caso isso aconteça, a ordem dentro do grupamento será 0, caso contrário, será o maior valor de ordem somando-se 1), mas antes, devemos verificar se estamos tratando de uma questão genérica, caso seja uma questão genérica não possuirá grupo e, por conseguência, terá o 'questionGroupID' nulo. Se tivermos uma verificação de nulo, devemos utilizar a declaração lógica 'is'ao invéz de '='. 
```JavaScript
let dynamic_statement = '='
if (!req.body.questionGroupID)
  dynamic_statement = 'is'
```
Executamos a seguinte querry, inserindo a variável que define o tipo de comparação:
```SQL
'SELECT MAX(qgf.questionOrder) questionOrder 
from `tb_questions` q 
join `tb_questiongroupform` qgf on q.questionID=qgf.questionID 
where qgf.crfFormsID=? 
and q.questionGroupID ' + dynamic_statement + ' ?'
```

### Adicionar uma questão em um Form
Primeiramente, inserimos as informações da questão propriamente dita:
```SQL
INSERT INTO `tb_questions` (description, questionTypeID, questionGroupID) values (?, ?, ?)
```
Precisamos agora inserir a ordem da questão e fazer a ligação com o seu form no novo grupamento de questões, levando em conta sua última ordem, assim como supracitado:
```SQL
INSERT INTO `tb_questiongroupform` (questionID, crfFormsID, questionOrder) values (?, ?, ?)
```

## Grupos de questões
### Selecionar todos os grupamentos de questões
```SQL
SELECT * FROM `tb_questiongroup
```

### Inserir um grupamento
```SQL
INSERT INTO `tb_questiongroup` (description) VALUES (?)
```

### Remover um grupamento
```SQL
DELETE FROM `tb_questiongroup` WHERE questionGroupID = ?
```
### Editar um grupamento
```SQL
UPDATE `tb_questiongroup` SET description = ? WHERE questionGroupID = ?
```

## Alterações realizadas no BD
### Adicionada a chave primária 'questionaireID' na relação 'tb_questionaire'
```SQL
ALTER TABLE `tb_questionnaire`
  ADD PRIMARY KEY (`questionnaireID`);
```
### Adicionada a chave primária 'questionID' na relação 'tb_questions'
```SQL
ALTER TABLE `tb_questions`
  ADD PRIMARY KEY (`questionID`);
```
### Adicionada a chave primária 'questionGroupID' na relação 'tb_questiongroup'
```SQL
ALTER TABLE `tb_questiongroup`
  ADD PRIMARY KEY (`questionGroupID`);
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
### Mudando o campo 'questionID' da tabela 'tb_questions' para Auto_Increment
Essa mudança permite designar um id automáticamente às novas questões adicionadas na tabela.
```SQL
ALTER TABLE `tb_questions`
  MODIFY `questionID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=256;
```
### Mudando o campo 'questionGroupID' da relação 'tb_questiongroup' para Auto_Increment
Essa mudança permite designar um id automáticamente aos novos grupos de questões adicionados.
```SQL
ALTER TABLE `tb_questiongroup`
  MODIFY `questionGroupID` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
```

# Possíveis melhorias para o projeto
## Criação de um banco de questões
Atualmente, devido à estrutura do banco de dados, estamos limitados a um determinado número de questões em um form de um questionário, pois suas ordens necessitam de um formato de identificação específico para funcionar. Ao criar um banco de questões, será possível não só expandir as possibilidades em relação ao número de questões, mas também utilizar uma questão globalmente, de forma que todos os forms consigam referencia-la, evitando repetições de uma questão igual, porém em forms diferentes.
## Funcionalidades adicionais
Devido ao curto espaço de tempo para desenvolvimento do app focamos em funcionalidades básicas, porém, existem algumas funcionalidades adicionais que melhorariam a experiência que o usuário teria com o mesmo. Dentre elas, podemos citar:
- Editar o cometário sobre o grupo de questões
- Autenticação nas funcionalidades de remoção
- Exibição das questões aninhadas a uma questão pai

 `Rio de janeiro, 15 de Novembro de 2020, Universidade Federal do Rio de Janeiro`
