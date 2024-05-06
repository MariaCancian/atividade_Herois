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

  //
 

  app.listen(PORT, () => {
    console.log(`Servindor rodando na porta ${PORT}🚀`);
  });