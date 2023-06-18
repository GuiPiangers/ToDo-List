const listaID = [1, 2, 3]

function criarId(){
    let id = 1
    while(listaID.some((e)=> e === id)){
        id = parseInt(Math.random() * 1000)+1
    }   
    return id
}
listaID.push(criarId())
console.log(listaID)