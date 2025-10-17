

const inputnome = document.getElementById("nome");
const inputdescricao=document.getElementById("descricao");
const inputImage=document.getElementById("imagem");
const b1 = document.getElementById("b1");
let id= 0;

const listacards= document.getElementById("lista");
const campoBusca= document.getElementById("pesquisa");
const btnPesquisa= document.getElementById("btnp");
const jogosnatela=[];
const salvaredit= document.getElementById("b2");


b2.addEventListener("click",()=>{
     salvar()

})

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
btnedit.addEventListener("click",()=>{
  const gid = this.id;
  editarGame(gid);


})
    divCard.appendChild(conte);
    conte.appendChild(campoImagem)
    divCard.appendChild(descri)
    descri.appendChild(campoNome);
    descri.appendChild(campoDescricao);
    descri.appendChild(btnedit);
    descri.appendChild(btndelete);   
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
    console.log(jogoJson);
    jogosnatela.length = 0;
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
    const response = await fetch('http://localhost:8088/games', {
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
 
  } catch (error) {
    console.error('Falha ao salvar dados:', error);

  }
  attLista()
}

async function buscarTodosOsDados() {
  try {
   
    const response = await fetch('http://localhost:8088/games');

    if (!response.ok) {
      throw new Error(`Erro HTTP! Status: ${response.status}`);
    }


    const jogos = await response.json();
    
    
  
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

const editarGame= async(gid)=>{
campoBusca.value="";
await buscarGame()
await attLista()

  try{
    const response = await fetch(`http://localhost:3000/games/${gid}`);
  
    if (!response.ok){
      throw new Error("erro ao carregar");
    }
    const game = await response.json();
    
    inputImage.value=game.imagem;
    inputdescricao.value=game.descricao;
    inputnome.value= game.nome;

    id=game.id;
      }catch(error){
    console.log("falha",error);

  }

}

const salvar = async()=>{
  
  const gameAtualizado = new Game(
      id, 
      inputnome.value.trim(),
      inputdescricao.value.trim(),
      inputImage.value.trim()
  );

  try{
    const response= await fetch(`http://localhost:3000/games/${id}`,{
      method: 'PUT',
      headers:{
        'Content-Type': 'application/json'
      },
       body: JSON.stringify(gameAtualizado) 
    });
    
    if(!response.ok){
      throw new Error(`Erro: ${response.status}`);
    }
    
    const resultado=await response.json();

    attLista();


    inputnome.value = "";
    inputImage.value = "";
    inputdescricao.value = "";
    id = 0; 
    
  } catch (error) {
        console.error('Falha ao atualizar o jogo:', error);
        alert('Ocorreu um erro ao salvar as alterações.');
    }
}