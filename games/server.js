const express = require('express');
const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db',(err)=>{
    if(err){
        console.error("Erro ao conectar ao banco de dados",err.message);

    }else{
        console.log("conexao bem sucedida!")
    }
    db.run(`CREATE TABLE IF NOT EXISTS games (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT,
            imagem TEXT
        )`, (err) => {
            if (err) {
                console.error("Erro ao criar a tabela 'games':", err.message);
            } else {
                console.log("Tabela 'games' criada ou já existe.");
            }
        });
    
})


app.use(cors());
app.use(express.json());


app.get('/games', (req, res) => {
  db.all("SELECT * FROM games",(err,rows)=>{
    if (err){
        return res.status(500).json({message:"erro ao buscar contudo de jogos"});
    }
        res.status(200).json(rows);
  });

});
app.post('/games', (req, res) => {
    
    const { nome, descricao, imagem } = req.body;
    const sql = `INSERT INTO games (nome, descricao, imagem) VALUES (?, ?, ?)`;
    db.run(sql, [nome, descricao, imagem], function(err) {
        if (err) {
            console.error("Erro ao inserir jogo:", err.message);
            return res.status(500).json({ message: "Erro ao salvar o jogo." });
        }
     const novoJogo = { id: this.lastID, nome, descricao, imagem };
    return res.status(201).json({ 
            message: "Jogo adicionado com sucesso!", 
            game: novoJogo 
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});


app.delete('/games/:id',(req,res)=>{
    const id = req.params.id;
    const sql= "DELETE FROM games WHERE ID = ?";
    db.run(sql,id,function(err){

        if(err){
            res.status(500).json({error:err.message});
            return;
        }else{
            res.json({mensagem:`Item ${id} excluido`,id: this.id})
        }
    })

});