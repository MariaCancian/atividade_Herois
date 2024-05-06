   ----criação da DATABASE herois

   CREATE DATABASE herois;
   
   --crianção da tabela herois
    CREATE TABLE herois (
        id SERIAL PRIMARY KEY,
         nome VARCHAR(100) NOT NULL,
         poder VARCHAR(255)NOT NULL,
         nivel INT NOT NULL,
         pontos_de_vida INT NOT NULL
         
        
);

CREATE TABLE batalhas(
    id SERIAL PRIMARY KEY,
    heroi1_id INT NOT NULL,
    heroi2_id INT NOT NULL,
    vencedor_id INT NOT NULL,
    FOREIGN KEY (heroi1_id) REFERENCES herois(id),
    FOREIGN KEY (heroi2_id) REFERENCES herois(id),
    FOREIGN KEY (vencedor_id) REFERENCES herois(id)
   
);