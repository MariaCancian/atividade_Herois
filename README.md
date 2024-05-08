# API de Gerenciamento de Heróis - Sistema de Batalhas

Esta é uma API para gerenciamento de heróis e realização de batalhas entre eles.

## Configuração do Banco de Dados

A API utiliza um banco de dados PostgreSQL. Certifique-se de ter o PostgreSQL instalado e configurado em sua máquina. Além disso, é necessário criar um banco de dados com o nome herois. Você pode fazer isso executando o seguinte comando no terminal:

* Criar o banco de dados:

```bash
CREATE TABLE herois
```
#Rotas
* GET /: Retorna uma mensagem indicando que a rota está funcionando.
  
* Rotas de Heróis

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
  
