   ----criação da DATABASE herois

   CREATE DATABASE herois;
   
   --crianção da tabela herois
    CREATE TABLE herois (
        id SERIAL PRIMARY KEY,
         nome VARCHAR(100) NOT NULL,
         poder VARCHAR(255)NOT NULL,
         nivel INT NOT NULL,
         pontos_de_vida INT NOT NULL
         
        
)       ;