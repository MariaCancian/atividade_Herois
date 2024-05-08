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
    const { id } = req.query;
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

app.get("/herois/:heroi1_id/:heroi2_id", async (req, res) => {


  try {
    // Criação de variáveis para armazenar os IDs dos heróis
    const { heroi1_id, heroi2_id } = req.params;

    let heroiParam =(
      await pool.query("SELECT * FROM herois WHERE id = $1",[heroi1_id])
    ).rows[0];
    let heroiParam2 =(
      await pool.query("SELECT * FROM herois WHERE id = $1",[heroi2_id])
    ).rows[0];
    

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
    const query = `
      SELECT 
        b.id, 
        b.heroi1_id, 
        h1.nome AS heroi1_nome, 
        b.heroi2_id, 
        h2.nome AS heroi2_nome, 
        b.vencedor_id, 
        h3.nome AS vencedor_nome
      FROM batalhas b
      INNER JOIN herois h1 ON b.heroi1_id = h1.id
      INNER JOIN herois h2 ON b.heroi2_id = h2.id
      INNER JOIN herois h3 ON b.vencedor_id = h3.id
    `;
    const resultado = await pool.query(query);
    res.json(resultado.rows);
  } catch (error) {
    console.error("Erro ao obter o histórico completo de batalhas:", error);
    res.status(500).send("Erro ao obter o histórico completo de batalhas");
  }
});

app.get("/herois/:nome", async (req, res) => {
  try {
    const { nome } = req.params;
    const resultado = await pool.query("SELECT * FROM herois WHERE nome ILIKE $1", [
      `%${nome}%`,
    ]);
    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: "Herói não encontrado" });
    } else {
      return res.json(resultado.rows);
    }
  } catch (error) {
    console.error("Erro ao obter herói por nome:", error);
    res.status(500).json('erro ao obter herói');
  }
});

app.get("/herois/:nome/batalhas", async (req, res) => {
  try {
    const { nome } = req.params;
    const query = `
      SELECT hb.id, hb.heroi1_id, h1.nome AS nome_heroi1, hb.heroi2_id, h2.nome AS nome_heroi2, hb.vencedor_id, hv.nome AS nome_vencedor
      FROM historicoBatalhas hb
      INNER JOIN herois h1 ON hb.heroi1_id = h1.id
      INNER JOIN herois h2 ON hb.heroi2_id = h2.id
      INNER JOIN herois hv ON hb.vencedor_id = hv.id
      WHERE LOWER(h1.nome) LIKE LOWER($1) OR LOWER(h2.nome) LIKE LOWER($1)
    `;
    const resultado = await pool.query(query, [`%${nome}%`]);
    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensagem: "Nenhuma batalha encontrada para este herói" });
    } else {
      return res.json(resultado.rows);
    }
  } catch (error) {
    console.error("Erro ao obter batalhas por nome do herói:", error);
    res.status(500).json('Erro ao obter batalhas por nome do herói');
  }
});

app.get('/batalhas/:nome', async (req, res) => {
  const { nome } = req.params;
  try {
      const result = await pool.query('SELECT * FROM herois WHERE nome = $1', [nome]);
      if (result.rowCount === 0) {
          res.status(404).send({ mensagem: 'Herói não encontrado' });
      } else {
          const heroi = result.rows[0];
          
          const batalhas = await pool.query(
            'SELECT b.id as numero_batalha, b.heroi1_id, h1.nome AS nome_heroi1, b.heroi2_id, h2.nome AS nome_heroi2, b.vencedor_id, h3.nome AS nome_vencedor FROM batalhas b INNER JOIN herois h1 ON b.heroi1_id = h1.id INNER JOIN herois h2 ON b.heroi2_id = h2.id INNER JOIN herois h3 ON b.vencedor_id = h3.id WHERE h1.nome = $1 OR h2.nome = $1',
            [nome]
          );
          
          const batalhasFormatadas = batalhas.rows.map(batalha => {
              return {
                  id: batalha.numero_batalha,
                  heroi_1: {
                      nome: batalha.nome_heroi1,
                      // Aqui você pode adicionar mais campos do herói, se necessário
                  },
                  heroi_2: {
                      nome: batalha.nome_heroi2,
                      // Aqui você pode adicionar mais campos do herói, se necessário
                  },
                  vencedor: {
                      nome: batalha.nome_vencedor,
                      // Aqui você pode adicionar mais campos do herói, se necessário
                  }
              };
          });

          res.json({
              total: batalhas.rowCount,
              batalhas: batalhasFormatadas,
          });

      }
  } catch (error) {
      console.error('Erro ao obter herói por nome:', error);
      res.status(500).send('Erro ao obter herói por nome');
  }
});




app.listen(PORT, () => {
  console.log(`Servindor rodando na porta ${PORT}🚀`);
});
