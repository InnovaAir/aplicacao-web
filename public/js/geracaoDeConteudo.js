function gerarListaItens() {
    let html =  document.getElementById("item_lista")
    html.innerHTML = ""
    for (let index = 0; index <= 99; index++) {
        let identificacaoAleatoria = Math.floor(Math.random() * 9000) + 1000;
        let usoAleatorio1 = Math.floor(Math.random() * 90);
        let usoAleatorio2 = Math.floor(Math.random() * 90);
        let usoAleatorio3 = Math.floor(Math.random() * 90);

        let diaAleatorio = Math.floor(Math.random() * 20);
        let hrsAleatoria = Math.floor(Math.random() * 25);
        let minAleatorio = Math.floor(Math.random() * 61);
        
        

        html.innerHTML += `<li class="item">
                            <div class="dados">
                                <span class="dados_lista">TAM-${identificacaoAleatoria}</span>
                                <span class="dados_lista">${usoAleatorio1}%</span>
                                <span class="dados_lista">${usoAleatorio2}%</span>
                                <span class="dados_lista">${usoAleatorio3}%</span>
                                <span class="dados_lista">${diaAleatorio}d ${hrsAleatoria}hs ${minAleatorio}m</span>
                             </div>
                             <button class="botao">Abrir</button>
                            </li>`
    }
}