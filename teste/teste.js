let nomes = ['bernardo', 'brenda', 'Fernanda', 'Amanda']
let pesquisar = /b/gi

nomes.forEach( (nome) =>{

    if(nome.match(pesquisar)){
        console.log(nome)
    }
})

