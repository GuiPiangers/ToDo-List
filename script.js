const popup_wrapper = document.querySelector(".popup-wrapper")
const bt_nova_tarefa = document.querySelector("#bt-nova-tarefa")
const p_nova_tarefa = document.querySelector("#p-criar-tarefa")
const input_pesquisar = document.querySelector('#pesquisar')
const select_ordenar = document.querySelector('#oredenarPor')
const cabecalho_listas = document.querySelectorAll('.cabecalho-lista')

const h2_titulo_popup = document.querySelector('#popup-titulo')
const id_input = document.querySelector('#id-input')
const input_nome_da_tarefa = document.querySelector('#input-tarefa-nome')
const input_data_da_tarefa = document.querySelector('#input-data')
const input_hora_da_tarefa = document.querySelector('#input-time')
const select_prioridade = document.querySelector('#select-prioridade')
const bt_criar_tarefa = document.querySelector('#bt-criar-tarefa')
const bt_editar_tarefa = document.querySelector('#bt-criar-editar')

const div_nenhum_item = document.querySelector('#nenhum-item')
const lista_de_tarefas_anteriores = document.querySelector('#div-anteriores')
const lista_de_tarefas_hoje = document.querySelector('#div-hoje')
const lista_de_tarefas_futuras = document.querySelector('#div-futuro')
const lista_de_tarefas_concluidas_hoje = document.querySelector('#div-concluidos-hoje')

const array_lista_de_tarefas = []  
const array_checked = []
const data_atual_formatada =  new Intl.DateTimeFormat('pt-BR').format()

//popup --------------------------------------------------------------------------

function abrirPopup(id){
    popup_wrapper.style.display = 'flex'
    input_nome_da_tarefa.focus()

    if(id){
        bt_criar_tarefa.style.display = "none"
        bt_editar_tarefa.style.display = "inline"

        h2_titulo_popup.innerHTML = 'Editar Tarefa'

        const index = verificaIndexDoId(array_lista_de_tarefas, id)
        const tarefa = array_lista_de_tarefas[index]

        id_input.value = tarefa.id
        input_nome_da_tarefa.value = tarefa.nome
        input_data_da_tarefa.value = desformatarData(tarefa.data)
        input_hora_da_tarefa.value = tarefa.hora
        select_prioridade.value = tarefa.prioridade

    }
    else{
        h2_titulo_popup.innerHTML = 'Nova Tarefa'
        bt_criar_tarefa.style.display = "inline"
        bt_editar_tarefa.style.display = "none"
    }
}



function fecharPopup(event){
    const classe_do_elemento_clicado = event.target.classList[0]
    const classes_que_fecham_popup = ['x-close-wrapper', 'popup-wrapper', 'bt-tarefa', 'bt-cancelar']
    const fecha_popup = classes_que_fecham_popup.some((className) => className === classe_do_elemento_clicado)

    if(fecha_popup){
        popup_wrapper.style.display = 'none'
        limparPopup()
    }
}

//----------------------------------------------------------------------------------------------------------------

function adicionarListaNaLocalStorage(){
    localStorage.setItem('listaDeTarefas', JSON.stringify(array_lista_de_tarefas))
}
function recuperarDadosDaLocalStorage(){
    const listaDeItems = localStorage.getItem('listaDeTarefas')
    if(listaDeItems){
        const items = JSON.parse(listaDeItems)
        for (const item of items) {
            array_lista_de_tarefas.push(item)
        }
    }    
}

function criarId(){
    let id = parseInt(Math.random() * 999999)+1
    while(array_lista_de_tarefas.some((e)=> e.id === id)){
        id = parseInt(Math.random() * 999999)+1
    }   
    return id
}

function resetarHTMLListas(){
    lista_de_tarefas_anteriores.innerHTML = ""
    lista_de_tarefas_hoje.innerHTML = ""
    lista_de_tarefas_futuras.innerHTML = ""    
}

function criarTarefa(){
    const novaTarefa = {
        id: criarId(),
        nome: input_nome_da_tarefa.value,
        data: input_data_da_tarefa.value != "" ?formatarData(input_data_da_tarefa.value) : data_atual_formatada,
        hora: input_hora_da_tarefa.value,
        prioridade: select_prioridade.value,
    }
    input_pesquisar.value = ''
    array_lista_de_tarefas.push(novaTarefa)
}

function editarTarefa(){
    const tarefa = {
        id: id_input.value,
        nome: input_nome_da_tarefa.value,
        data: formatarData(input_data_da_tarefa.value),
        hora: input_hora_da_tarefa.value,
        prioridade: select_prioridade.value,
    }

    const index = verificaIndexDoId(array_lista_de_tarefas, id_input.value)
    array_lista_de_tarefas[index] = tarefa   
    input_pesquisar.value = ''
}

function pesquisarTarefa(e){

    const pesquisarPor = e.target.value

    const listaFiltrada = array_lista_de_tarefas.filter((tarefa) =>{
        return tarefa.nome.toLowerCase().match(pesquisarPor.toLowerCase())
    })
    gerarTarefaNoDOM(listaFiltrada)

}

function ordenarTarefasPorData(){
    array_lista_de_tarefas.sort ((a, b)=>{
        if(desformatarData(a.data) < desformatarData(b.data)){
            return -1
        }
        else if(desformatarData(a.data) > desformatarData(b.data)){
            return true
        }
        else if(desformatarData(a.data) === desformatarData(b.data)){
           if(desformatarData(a.hora) < desformatarData(b.hora)){
                return -1
            }
            else if(desformatarData(a.hora) > desformatarData(b.hora)){
                return true
            }
        }
    })
    gerarTarefaNoDOM(array_lista_de_tarefas)
}

function ordenarTarefasPorPrioridade(){
    array_lista_de_tarefas.sort ((a, b)=>{
        if(a.prioridade < b.prioridade){
            return -1
        }
        else{
            return true
        }
    })
    gerarTarefaNoDOM(array_lista_de_tarefas)
}


function gerarTarefaNoDOM(lista){
    resetarHTMLListas()
    lista.forEach( (tarefa) =>{

        const div_tarefa = document.createElement('div')
        div_tarefa.classList.add("tarefa")
        div_tarefa.draggable = true

        const id_tarefa = document.createElement('input')
        id_tarefa.type = "hidden"
        id_tarefa.value = tarefa.id
        div_tarefa.appendChild(id_tarefa)
      
        const div_nome_tarefa = document.createElement('div')
        div_nome_tarefa.classList.add('tarefa-nome')
        div_tarefa.appendChild(div_nome_tarefa)

        const span_check_tarefa = document.createElement('span')
        span_check_tarefa.classList.add('check-task')
        div_nome_tarefa.appendChild(span_check_tarefa)

        const p_nome_tarefa = document.createElement('p')
        p_nome_tarefa.innerText = tarefa.nome
        div_nome_tarefa.appendChild(p_nome_tarefa)

        
        const div_data_hora = document.createElement('div')
        div_data_hora.classList.add('data-hora')
        div_tarefa.appendChild(div_data_hora)

        const p_prioridade = document.createElement('p')
       
        switch(tarefa.prioridade){
            case '1': 
                p_prioridade.innerText =  'Alta'
                p_prioridade.style.backgroundColor = '#e38079'
                break;    
            case '2': 
                p_prioridade.innerText = 'Media'
                p_prioridade.style.backgroundColor = '#debd6a'
                break;    
                case '3': 
                p_prioridade.innerText =  'Baixa' 
                p_prioridade.style.backgroundColor = '#85b4f0'
                break;           
        } 
        p_prioridade.classList.add('prioridade')
        if(tarefa.prioridade === '1'){

        }
        div_data_hora.appendChild(p_prioridade)
        
        const p_data = document.createElement('p')
        p_data.classList.add('data')
        p_data.innerText = tarefa.data
        div_data_hora.appendChild(p_data)

        const p_hora = document.createElement('p')
        p_hora.classList.add('hora')
        p_hora.innerText = tarefa.hora
        if(tarefa.hora !=''){
            div_data_hora.appendChild(p_hora)
        }

        const bt_excluir = document.createElement('button')
        bt_excluir.classList.add('excluir-tarefa')
        bt_excluir.classList.add('material-symbols-outlined')
        bt_excluir.innerText = 'delete'
        div_data_hora.appendChild(bt_excluir)
        adicionarTarefaNasListas(desformatarData(tarefa.data), div_tarefa)
    })
}

function adicionarTarefaNasListas(data, tarefa){

    if(data < desformatarData(data_atual_formatada)){
        return lista_de_tarefas_anteriores.appendChild(tarefa)
    }

    if(data === desformatarData(data_atual_formatada)){
        return lista_de_tarefas_hoje.appendChild(tarefa)
    }

    if(data > desformatarData(data_atual_formatada)){
        return lista_de_tarefas_futuras.appendChild(tarefa)
    }
}

function limparPopup(){
    id_input.value = ''
    input_nome_da_tarefa.value = ''
    input_data_da_tarefa.value = ''
    input_hora_da_tarefa.value = ''

}

function setVisibleNenhumItem(){
    if(lista_de_tarefas_hoje.innerHTML === '' && input_pesquisar.value === ''){
        div_nenhum_item.style.display = 'flex'
    }
    else{
        div_nenhum_item.style.display = 'none'
    }
}

function setVisibleTarefas(){
    const lista_total = 
    [lista_de_tarefas_anteriores, lista_de_tarefas_hoje, lista_de_tarefas_futuras, lista_de_tarefas_concluidas_hoje];
    lista_total.forEach( (lista) =>{
        const elemento_pai = lista.parentNode

        if(lista.innerHTML == ""){
            elemento_pai.style.display = 'none'
        }
        else{
            elemento_pai.style.display = 'block'
        }
    })
}

function formatarData(data){
    let dataSeparada = data.split('-')
    dataSeparada.reverse()
    let datajunta = dataSeparada.join("/")
    
    return datajunta
}

function desformatarData(data){
    let dataSeparada = data.split('/')
    dataSeparada.reverse()
    let datajunta = dataSeparada.join("-")
    return datajunta
}

function verificaIndexDoId(array, id){
    const index = array.findIndex( (tarefa) =>{
        return tarefa.id == id
    })
    return index
}

function checkTarefa(element){
    const elemento_clicado = element
    const elemento_pai = elemento_clicado.closest("div.tarefa")
     
    if(elemento_clicado.classList.contains("check-task")){
        const id_tarefa = elemento_pai.querySelector('input')
        const div_data = elemento_pai.querySelector('div.data-hora > p.data')
       
        if(elemento_pai.classList.contains('checked')){
            elemento_pai.classList.remove('checked')
            
            const index = verificaIndexDoId(array_checked, id_tarefa.value)

            adicionarTarefaNasListas(desformatarData(div_data.innerText), elemento_pai)
            
            const item_deletado = array_checked.splice(index, 1)
            array_lista_de_tarefas.push(item_deletado[0])
        }
        else{
            elemento_pai.classList.add('checked')
            const index = verificaIndexDoId(array_lista_de_tarefas, id_tarefa.value)

            lista_de_tarefas_concluidas_hoje.appendChild(elemento_pai)

            const item_deletado = array_lista_de_tarefas.splice(index, 1)
            array_checked.push(item_deletado[0])
        }
    }
}

function tarefaClicada(element){
    const elemento_clicado = element
    const elemento_pai = elemento_clicado.closest("div.tarefa")

    const classes_para_nao_editar_tarfa = ['check-task', 'excluir-tarefa']
    const nao_editar_tarefa = classes_para_nao_editar_tarfa.some( (e)=>{
        return e === elemento_clicado.classList[0]
    })

    if(elemento_pai && !nao_editar_tarefa){
        const id_tarefa = elemento_pai.firstElementChild
        abrirPopup(id_tarefa.value)
    }
    if(elemento_clicado.classList.contains('excluir-tarefa')){
        const id_tarefa = elemento_pai.querySelector('input')
        const index = verificaIndexDoId(array_lista_de_tarefas, id_tarefa.value)
        array_lista_de_tarefas.splice(index, 1)
        gerarTarefaNoDOM(array_lista_de_tarefas)
    }
}



bt_nova_tarefa.addEventListener('click', () => {
    abrirPopup()
})
popup_wrapper.addEventListener('click', (event) => {
    fecharPopup(event)
})

bt_criar_tarefa.addEventListener('click', () => {
    criarTarefa()
    gerarTarefaNoDOM(array_lista_de_tarefas)
})
bt_editar_tarefa.addEventListener('click', () =>{
    editarTarefa()
    gerarTarefaNoDOM(array_lista_de_tarefas)
})

p_nova_tarefa.addEventListener('click', () =>{
    abrirPopup()
})

input_pesquisar.addEventListener('keyup', (e)=>{
    pesquisarTarefa(e)
    setVisibleTarefas()
})

document.addEventListener("click", (e) => {
    tarefaClicada(e.target)
    checkTarefa(e.target)
    adicionarListaNaLocalStorage()
    setVisibleTarefas()
    setVisibleNenhumItem()
})
select_ordenar.addEventListener('change', () =>{
    if(select_ordenar.value === 'data'){
        ordenarTarefasPorData()
    }
    if(select_ordenar.value === 'prioridade'){
        ordenarTarefasPorPrioridade()
    }
})
console.log(cabecalho_listas)
cabecalho_listas.forEach((cabecalho)=>{
    console.log(cabecalho)
    cabecalho.addEventListener('click', ()=> {
        const body_lista = cabecalho.parentNode.querySelector('div.body-lista')
        const arrow = cabecalho.querySelector('span')
        if(body_lista.style.display != 'none'){
            body_lista.style.display  = 'none'
            arrow.innerText = 'arrow_drop_down'
        }
        else{
            body_lista.style.display = 'block'
            arrow.innerText = 'arrow_drop_up'
        }
    })
})

recuperarDadosDaLocalStorage()
gerarTarefaNoDOM(array_lista_de_tarefas)
setVisibleTarefas()
setVisibleNenhumItem()

const columns = document.querySelectorAll('.body-lista')

document.addEventListener("dragstart", (e) =>{
    e.target.classList.add("dragging")
})
document.addEventListener("dragend", (e) =>{
    e.target.classList.remove("dragging")
})

columns.forEach((item) =>{
    item.addEventListener("dragover", (e) =>{
        const draggin = document.querySelector('.dragging')
        const applyAfter = getNewPosition(item, e.clientY)


        if(applyAfter){
            applyAfter.insertAdjacentElement("afterend", draggin)
        }
        else{
            item.prepend(draggin)
        }


    })
})

function getNewPosition(column, positionY){
    const cards = column.querySelectorAll(".body-lista > div.tarefa:not(.dragging)")
    let result

    for(let referCard of cards){
        const box = referCard.getBoundingClientRect()
        const boxCenterY = box.y + box.height / 2

        if (positionY >= boxCenterY) result = referCard
    }

    return result
}

