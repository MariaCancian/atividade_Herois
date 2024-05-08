# API de Gerenciamento de Heróis - Sistema de Batalhas

Esta é uma API simples para gerenciar batalhas entre heróis.

## Funcionalidades

- Listar todos os heróis
- Adicionar um novo herói
- Atualizar um herói existente
- Excluir um herói
- Realizar uma batalha entre dois heróis
- Listar todas as batalhas realizadas
- Listar batalhas de um herói específico

## Endpoints

### Listar todos os heróis

## Configuração do Banco de Dados

A API utiliza um banco de dados PostgreSQL. Certifique-se de ter o PostgreSQL instalado e configurado em sua máquina. Além disso, é necessário criar um banco de dados com o nome herois. Você pode fazer isso executando o seguinte comando no terminal:

* Criar o banco de dados:

```bash
CREATE TABLE herois
```
#Rotas
* GET /: Retorna uma mensagem indicando que a rota está funcionando. (GET /herois)
  

* GET /herois: Retorna todos os heróis cadastrados.

* POST /herois: Adiciona um novo herói.

* GET /herois/:id: Retorna os detalhes de um herói específico.

 * PUT /herois/:id: Atualiza as informações de um herói existente.

* DELETE /herois/:id: Deleta um herói pelo seu ID.

* GET /batalha?heroi1_id=<ID>&heroi2_id=<ID>: Realiza uma batalha entre dois heróis.
* GET /batalhas: Retorna o histórico de todas as batalhas registradas.
* GET /batalhas/completas: Retorna o histórico de batalhas com detalhes dos heróis envolvidos.
* GET /herois/nome/:nome: Filtra os heróis pelo nome.
* GET /herois/:nome/batalhas: Retorna as batalhas em que o herói participou, filtrando pelo nome.
# Exemplo de Uso
* Cadastre alguns heróis usando a rota POST /herois.
* Realize batalhas entre os heróis usando a rota GET /batalha.
* Consulte o histórico de batalhas usando a rota GET /batalhas.
* Consulte o histórico de batalhas com detalhes dos heróis usando a rota GET /batalhas/completas.
* Filte os heróis pelo nome usando a rota GET /herois/nome/:nome.
* Consulte as batalhas em que um herói específico participou usando a rota GET /herois/:nome/batalhas.

  ## Configuração do Banco de Dados

Esta API utiliza PostgreSQL como banco de dados. Certifique-se de configurar corretamente as credenciais de acesso ao banco de dados no arquivo `index.js`.

## Executando a Aplicação

1. Clone este repositório.

2. Instale as dependências utilizando o comando: npm install

 3. Inicie o servidor com o comando: npm start
    
4. Acesse a API através do URL `http://localhost:3000`.

## Exemplo de Uso

- Listar todos os heróis: GET http://localhost:3000/herois
  
  - Adicionar um novo herói:
    POST http://localhost:3000/herois
Body:
{
"nome": "Batman",
"poder": "Inteligência",
"nivel": 10,
"pontos_de_vida": 100
}

- Realizar uma batalha entre dois heróis:
  GET http://localhost:3000/herois/1/2

## Autor
Maria Eduarda Cancian Silva
  
