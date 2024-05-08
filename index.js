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
    // Criação de variáveis para armazenar os IDs dos heróis
    const { heroi1_id, heroi2_id } = req.query;

    // Se os IDs não forem fornecidos, retorna um erro 400
    if (!heroi1_id || !heroi2_id) {
      return res.status(400).json({ mensagem: "IDs dos heróis não fornecidos" });
    }

    // Pegando os dados dos heróis através dos IDs fornecidos
    const heroi1 = await heroiPorId(heroi1_id);
    const heroi2 = await heroiPorId(heroi2_id);

    // Verifica se os heróis foram encontrados
    if (!heroi1 || !heroi2) {
      return res.status(404).json({ mensagem: "Heróis não encontrados" });
    }

    // Lógica para determinar o vencedor
    let vencedorId;
    if (heroi1.nivel > heroi2.nivel) {
      vencedorId = heroi1_id;
    } else if (heroi2.nivel > heroi1.nivel) {
      vencedorId = heroi2_id;
    } else {
      // Em caso de empate de nível, seleciona o herói com mais pontos de vida como vencedor
      vencedorId = heroi1.pontos_de_vida > heroi2.pontos_de_vida ? heroi1_id : heroi2_id;
    }

    // Inserir o ID do herói vencedor na tabela batalhas
    const query = 'INSERT INTO batalhas (heroi1_id, heroi2_id, vencedor_id) VALUES ($1, $2, $3)';
    await pool.query(query, [heroi1_id, heroi2_id, vencedorId]);

    // Retorna os detalhes completos da batalha
    res.status(200).json({
      mensagem: "Batalha realizada com sucesso",
      heroi1: heroi1,
      heroi2: heroi2,
      vencedor: vencedorId
    });

  } catch (error) {
    console.error("Erro ao realizar a batalha:", error);
    res.status(500).send("Erro ao realizar a batalha");
  }
});


app.get("/batalhas", async (req, res) => {
  try {
    // Consulta ao banco de dados para obter todas as batalhas
    const resultado = await pool.query("SELECT * FROM batalhas");

    // Retorna as batalhas encontradas
    res.status(200).json(resultado.rows);
  } catch (error) {
    console.error("Erro ao obter o histórico de batalhas:", error);
    res.status(500).send("Erro ao obter o histórico de batalhas");
  }
});



app.listen(PORT, () => {
  console.log(`Servindor rodando na porta ${PORT}🚀`);
});
