
const inputnome = document.getElementById("nome");
const inputdescricao=document.getElementById("descricao");
const inputImage=document.getElementById("imagem");
const b1 = document.getElementById("b1");

const listacards= document.getElementById("lista");
const campoBusca= document.getElementById("pesquisa");
const btnPesquisa= document.getElementById("btnp");
const jogosnatela=[];




class Game{
    constructor(id,nome,descricao,imagem){  
         
        this.id=id;
        this.nome=nome;
        this.descricao=descricao;
        this.imagem=imagem;
    }

criarCard(){
    const divCard=document.createElement("div");
    divCard.classList.add("card");
    const conte = document.createElement("conte");
    conte.classList.add("conte");
    const campoImagem=document.createElement("img");
    campoImagem.classList.add("img")
    campoImagem.src = this.imagem;
    const descri = document.createElement("descri");
    descri.classList.add("descri");
    const campoNome= document.createElement("h1");
    campoNome.textContent=`Nome:${this.nome}`;
    const campoDescricao=document.createElement("h2");
    campoDescricao.textContent=`Descricao:${this.descricao}`;
    const btnedit= document.createElement("button");
    btnedit.classList.add("btnedit");
    btnedit.textContent = "Editar";
    btnedit.dataset.id = this.id;
    const btndelete= document.createElement("button");
    btndelete.classList.add("btndelete");
    btndelete.textContent="Deletar";
btndelete.addEventListener("click",()=>{
    const gid = this.id;
    console.log(gid)
    deletarGame(gid);

});
    divCard.appendChild(conte);
    conte.appendChild(campoImagem)
    divCard.appendChild(descri)
    descri.appendChild(campoNome);
    descri.appendChild(campoDescricao);
    divCard.appendChild(btnedit);
    divCard.appendChild(btndelete);   
    return divCard;

}

}

const games = [];


const criarGame=()=>{
    gamenovo = new Game()
    gamenovo.nome=inputnome.value.trim();
    gamenovo.descricao=inputdescricao.value.trim();
    gamenovo.imagem=inputImage.value.trim();
    inputnome.value="";
    inputImage.value="";
    inputdescricao.value="";
    attLista();
    salvarDados(gamenovo);


}
const buscarGame= async()=>{
  
  const busca = campoBusca.value.trim().toLowerCase();
  const filtro = jogosnatela.filter(jogo=>{
    return jogo.nome.toLowerCase().includes(busca);

  })
    attListabusca(filtro);
    console.log(filtro);
    return filtro;
  


}
const attListabusca= (jogosbuscados)=>{
    
    listacards.innerText="";
    for (g of jogosbuscados){
        novocard=g.criarCard();
        listacards.appendChild(novocard)
       

    }
    
}


const attLista= async()=>{
    listacards.innerHTML = ''; 
    const jogoJson= await buscarTodosOsDados();
    console.log(jogoJson)
    const jogosComoObjetos = jogoJson.map(jogoJson => {
            return new Game(jogoJson.id,jogoJson.nome, jogoJson.descricao, jogoJson.imagem);
        });
    listacards.innerText="";
    for (g of jogosComoObjetos){
        novocard=g.criarCard();
        listacards.appendChild(novocard)
        jogosnatela.push(g);

    }
    
}

b1.addEventListener("click",criarGame)
campoBusca.addEventListener("input",buscarGame);




async function salvarDados(dadosParaSalvar) {
  try {
    const response = await fetch('http://localhost:3000/games', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosParaSalvar) 
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }

    const resultado = await response.json();
    console.log('Resposta do servidor:', resultado);
    alert('Dados salvos com sucesso!');
  } catch (error) {
    console.error('Falha ao salvar dados:', error);

  }
  attLista()
}

async function buscarTodosOsDados() {
  try {
   
    const response = await fetch('http://localhost:3000/games');

    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }


    const jogos = await response.json();
    
    
   console.log(jogos);
    return jogos;

  } catch (error) {
    console.error('Falha ao buscar dados:', error);
    return null;
  }
}
attLista()




const deletarGame=async(gid)=>{
try{
const response = await fetch(`http://localhost:3000/games/${gid}`,{
  method:'DELETE'
});
   if(!response.ok){
    throw new Error(`Erro HTTP! Status: ${response.status}`);
   }
   const resultado = await response.json();
   attLista();

  } catch (error) {
    console.error('Falha ao deletar o jogo:', error);
    alert('Ocorreu um erro ao excluir o jogo.');
  }
}