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
 

  app.listen(PORT, () => {
    console.log(`Servindor rodando na porta ${PORT}🚀`);
  });