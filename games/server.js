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

app.put('/games/:id', (req, res) => {
   
    const id = req.params.id;
    const { nome, descricao, imagem } = req.body;
    
    
    const sql = `UPDATE games SET nome = ?, descricao = ?, imagem = ? WHERE id = ?`;
    const params = [nome, descricao, imagem, id];


    db.run(sql, params, function (err) {
        if (err) {
           
            console.error(err.message);
            res.status(400).json({ "error": err.message });
            return;
        }


        if (this.changes > 0) {
    
            res.status(200).json({
                message: 'success',
                changes: this.changes,
                id: id
            });
        } else {
           
            res.status(404).json({
                message: `Game com ID ${id} não encontrado.`
            });
        }
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
app.get('/games/:id',(req,res)=>{
    const id = req.params.id
    const sql = "SELECT * FROM games WHERE id = ?";
    db.get(sql,id,(err,row)=>{
        if(err){
            res.status(500).json({error:err.message});
            return;
        }else{
           
              res.status(200).json(row);
                  
        }
});
});





app.post('/gameslista', (req, res) => {
    
    const jogos = req.body;
db.serialize(()=>{
     db.run("BEGIN TRANSACTION;");
      const stmt = db.prepare('INSERT INTO games (nome, descricao, imagem) VALUES (?, ?, ?)');
    jogos.forEach(game => {
            const { nome, descricao, imagem } = game;
    
    stmt.run( [nome, descricao, imagem], function(err) {
        if (err) {
            console.error("Erro ao inserir jogo:", err.message);
            return res.status(500).json({ message: "Erro ao salvar o jogo." });
        }
     const novoJogo = { id: this.lastID, nome, descricao, imagem };
    

    })
       stmt.finalize(() => {
          
            db.run("COMMIT;", (err) => {
                if (err) {
                    return res.status(500).json({ mensagem: 'Erro ao finalizar a transação.' });
                }
                
                res.status(201).json({ mensagem: `${jogos.length} jogos inseridos com sucesso!` });
            });
        });

})  
return res.status(201).json({ 
            message: "Jogo adicionado com sucesso!", 
      
        });
});
});
     