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

//função para eu pegar id do heroi
async function heroiPorId(id) {
  const resultado = await pool.query("SELECT * FROM herois WHERE id = $1", [
    id,
  ]);
  return resultado.rows[0];
}

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

app.post("/herois", async (req, res) => {
  try {
    const { nome, poder, nivel, pontos_de_vida } = req.body;
    await pool.query(
      "INSERT INTO herois (nome, poder, nivel, pontos_de_vida) VALUES ($1, $2, $3,$4)",
      [nome, poder, nivel, pontos_de_vida]
    );
    res.status(201).send({ mensagem: "heroi adicionado com sucesso" });
  } catch (error) {
    console.error("Erro ao adicionar herois:", error);
    res.status(500).send("Erro ao adicionar herois");
  }
});

//rota para deletar heroi
app.delete("/herois/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM herois WHERE id = $1", [id]);
    res.status(200).send({ mensagem: "herois deletado" });
  } catch (error) {
    console.error("Erro ao apagar o herois", error);
    res.status(500).send("erro ao apagar herois");
  }
});

//rota de editar herois
app.put("/herois/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, poder, nivel, pontos_de_vida } = req.body;
    await pool.query(
      "UPDATE herois SET nome = $1, poder = $2, nivel = $3, pontos_de_vida = $4 WHERE id = $5",
      [nome, poder, nivel, pontos_de_vida, id]
    );
    res.status(200).send({ mensagem: "heroi atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar heroi:", error);
    res.status(500).send("Erro ao atualizar heroi");
  }
});

app.get("/batalha", async (req, res) => {
  try {

 //criação de variavel  para armazenar heroi 
    const { heroi1_id, heroi2_id } = req.query;

    //se id não for fornecido não ira ser adicionada

    if (!heroi1_id || !heroi2_id) { return res
        .status(400)
        .json({ mensagem: "IDs dos heróis não fornecidos" });
    }

    //pegandos os dados dos herois atraves do id fornecido
    const heroi1 = await heroiPorId(heroi1_id);
    const heroi2 = await heroiPorId(heroi2_id);

    //para ver se heroi foi encontrado
    if (!heroi1 || !heroi2) {
      return res.status(404).json({ mensagem: "Heróis não encontrados" });
    }

    //logica do vencedor
    let vencedor;
    //se heroi 1, for maior que heroi 2, o vencedor será heroi 1
    if (heroi1.nivel > heroi2.nivel) {
      vencedor = heroi1;

      // e se heroi 2 for maior que heroi 1 o vencedor sera heroi 2
    } else if (heroi2.nivel > heroi1.nivel) {
      vencedor = heroi2;
    } else {
      // Em caso de empate, selecione um vencedor aleatório
      vencedor = Math.random() < 0.5 ? heroi1 : heroi2;
    }
    res
      .status(200)
      .json({ mensagem: "Batalha realizada com sucesso", vencedor });
  } catch (error) {
    console.error("Erro ao realizar a batalha:", error);
    res.status(500).send("Erro ao realizar a batalha");
  }
});

app.listen(PORT, () => {
  console.log(`Servindor rodando na porta ${PORT}🚀`);
});
