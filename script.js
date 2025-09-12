const entradanome = document.getElementById("entrada1");
const sobreNome= document.getElementById("entrada2");
const idadeentrada= document.getElementById("idade")
const botao1 = document.getElementById("b1");


const listarCards= document.getElementById("listacards")
class Pessoa{
    constructor(nome,sobrenome,idade){
        this.nome=nome;
        this.sobrenome=sobrenome;
        this.idade=idade;
    }

criarcard(){
        const carddiv= document.createElement("div");
        carddiv.classList.add("card")
        const nameElement= document.createElement("h1");
        nameElement.textContent=`Nome:${this.nome}`;
        const sobrenomeElement=document.createElement("h2")
        sobrenomeElement.textContent=`Sobrenome:${this.sobrenome}`
        const idadeElement=document.createElement("p")
        idadeElement.textContent=`Idade:${this.idade} anos`;
        carddiv.appendChild(nameElement);
        carddiv.appendChild(sobrenomeElement);
        carddiv.appendChild(idadeElement);

        return carddiv;

}


}
const listaDePessoas=[];

listaDePessoas.push(new Pessoa("Ana", "Silva", 25));
listaDePessoas.push(new Pessoa("João", "Santos", 30));
listaDePessoas.push(new Pessoa("Mariana", "Oliveira", 22));

const criarnovo=()=>{

    const novapessoa = new Pessoa
    novapessoa.nome=entradanome.value.trim();
    novapessoa.sobrenome=sobreNome.value.trim();
    novapessoa.idade=idadeentrada.value.trim();
    listaDePessoas.push(novapessoa);
    entradanome.value="";
    sobreNome.value="";
    idadeentrada.value="";
    renderizar()

    

}

const renderizar=()=>{
    listarCards.innerText="";
    for (const pessoa of listaDePessoas){
        const card = pessoa.criarcard();
        listarCards.appendChild(card)


    }
}
const dadosPessoasJson=[
  {
    "nome": "Ana",
    "sobrenome": "Silva",
    "idade": 25
  },
  {
    "nome": "Bruno",
    "sobrenome": "Santos",
    "idade": 30
  },
  {
    "nome": "Carla",
    "sobrenome": "Oliveira",
    "idade": 42
  },
  {
    "nome": "Daniel",
    "sobrenome": "Ferreira",
    "idade": 35
  },
  {
    "nome": "Elisa",
    "sobrenome": "Costa",
    "idade": 29
  }
]
dadosPessoasJson.forEach(dado => {
  // Cria uma nova instância de Pessoa usando os dados do JSON
  const novaPessoa = new Pessoa(dado.nome, dado.sobrenome, dado.idade);
  listaDePessoas.push(novaPessoa);
});




botao1.addEventListener("click",criarnovo)

renderizar()