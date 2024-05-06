const express = require("express");
const { Pool } = require("pg");
const app = express();
const PORT = 3000;


//conexao com o banco de dados pg
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "herois", // Sem espaço antes do nome do banco de dados
    password: "05111729",
    port: 5432,
});
  
  app.use(express.json());

   //ROTA TESTE
app.get("/", (req, res) => {
    res.end("a rota funcionando!🚀");
  });

  //rota que tem todos
  app.get("/herois", async (req, res) => {
    try {
      const resultado = await pool.query("SELECT * FROM herois");
      res.json({
        total: resultado.rowCount,
        bruxo: resultado.rows,
      });
    } catch (error) {
      console.error("Erro ao obter todos os herois", error);
      res.status(500).send("Erro ao obter todos os herois");
    }
  });

  //rota que cria herois

  app.post('/herois', async (req, res) => {
    try {
      const { nome, poder, nivel, pontos_de_vida } = req.body;
      await pool.query('INSERT INTO herois (nome, poder, nivel, pontos_de_vida) VALUES ($1, $2, $3,$4)', [nome, poder, nivel, pontos_de_vida]);
      res.status(201).send({ mensagem: 'heroi adicionado com sucesso'});
    } catch (error) {
      console.error('Erro ao adicionar herois:', error);
      res.status(500).send('Erro ao adicionar herois');
    }
  });
 

  app.listen(PORT, () => {
    console.log(`Servindor rodando na porta ${PORT}🚀`);
  });