let chartMensal;
let chartFiliais;

let garficoFilial = false;
let atualizar = null;

sessionStorage.setItem("filial", 0);

function gerarGraficos(){
    document.getElementById('mensal_Loading').style.display = "none";
    document.getElementById('filial_Loading').style.display = "none";
    document.getElementById('chartMensal').style.display = "flex";
    document.getElementById('chartFiliais').style.display = "flex";
Chart.register(ChartDataLabels);

    const ctxMensal = document.getElementById('chartMensal');
    chartMensal = new Chart(ctxMensal, {
        type: 'bar',
        data: {
            labels: [
                // 'Dezembro', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'
            ],
            datasets: [
                {
                    // label: 'CPU',
                    // backgroundColor: '#2e8b57',
                    // data: [5, 3, 4, 7, 9, 5],
                    hidden: false },
                {
                    // label: 'RAM',
                    // backgroundColor: '#5f9ea0',
                    // data: [1, 1, 4, 1, 2, 2],
                    hidden: true },
                {
                    // label: 'Disco',
                    // backgroundColor: '#f4c542',
                    // data: [2, 4, 4, 4, 3, 2],
                    hidden: true },
                {
                    // label: 'REDE',
                    // backgroundColor: '#8a2be2',
                    // data: [4, 4, 5, 2, 4, 1],
                    hidden: true }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels:{
                        color: '#000000',
                        font:{
                            weight: 'bold' //negrito
                        }
                    }
                },
                datalabels: {
                    color: '#000000',
                    font: {
                        weight: 'bold',
                        size: 17
                    },
                    anchor: 'end', // Ancorar na extremidade da barra (topo para barras verticais)
                    align: 'top',  // Alinhar a PARTE DE BAIXO do texto com o ponto de ancoragem.
                                    // Isso coloca o texto DENTRO da barra, logo abaixo da borda superior.
                    offset: 4,      // pequeno deslocamento para baixo.

                }
            },
        scales: { 
            x: {
                title: {
                    display: true,
                    text: 'Meses',
                    color: '#000000', // cor do título
                    font: {
                        size: 18,       // tamanho da fonte
                        weight: 'bold', // negrito (opcional)
                    }
                    }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Alertas',
                    color: '#000000', // cor do título
                    font: {
                        size: 18,       // tamanho da fonte
                        weight: 'bold', // negrito (opcional)
                    }
                },
                suggestedMax: 500
            }
        }
        },
        plugins: [ChartDataLabels]
    });

const ctxFiliais = document.getElementById('chartFiliais');
chartFiliais = new Chart(ctxFiliais, {
    type: 'bar',
    data: {
        labels: [
            // 'Guarulhos', 'Galeão', 'BHorizonte', 'Brasília', 'Confins', 'Viracopos', 'Congonhas', 'Salvador'
        ],
        datasets: [{
            backgroundColor: [
  '#17A2B8ab', // Coral claro
  '#89023Eab', // Lavanda média
  '#DB5375ab', // Lilás rosado claro
  '#F2C078ab', // Pêssego claro
//   '#F8F9FA', // Lilás suave

//   '#FFB3BA', // Coral claro
//   '#D5AAFF', // Lavanda média
//   '#FFDAC1', // Pêssego claro
            ],
            data: [
                // 15, 35, 98, 52, 25, 38, 71, 25
            ]
        }],
        ids: [
            // '1', '2', '3', '4', '5', '6', '7', '8'
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: trocarMensal,
        color: '#000000',
        plugins: {
            datalabels: {
                color: '#000000',
                font: { weight: 'bold', size: 20 }
            },
            // legend: {
            //     position: 'top',
            //     labels: {
            //         generateLabels: function(chart) {
            //             return [
            //                 { text: 'OK (0 - 20)', fillStyle: 'green', strokeStyle: '#000', lineWidth: 1 },
            //                 { text: 'Atenção (21 - 50)', fillStyle: '#e6e604', strokeStyle: '#000', lineWidth: 1 },
            //                 { text: 'Crítico (51 - ~)', fillStyle: 'red', strokeStyle: '#000', lineWidth: 1 }
            //             ];
            //         }
            //     }
            // }
            legend: {
                display: false
            }
        },
        scales: { 
        x: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Filiais',
                color: '#000000', // cor do título
                font: {
                    size: 18,       // tamanho da fonte
                    weight: 'bold', // negrito (opcional)
                }
                }
        },
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: 'Alertas',
                color: '#000000', // cor do título
                font: {
                    size: 18,       // tamanho da fonte
                    weight: 'bold', // negrito (opcional)
                }
                }
        }
        }
    },
    plugins: [ChartDataLabels]
});
}

function trocarMensal(evt, elements) {
    if (elements.length > 0) {
        const firstElement = elements[0];
        const label = chartFiliais.data.labels[firstElement.index];
        const ids = chartFiliais.data.ids[firstElement.index];
        sessionStorage.setItem("filial", ids);

        var clientefk = sessionStorage.fkCliente;
        garficoFilial = true;

        fetch("/marcolino/trocarGraficoMensal", {   
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                fkClienteServer: clientefk,
                fkFilialServer : ids,
            })
        }).then((resposta) => resposta.json())
        .then((dados) => {
            console.log("passei pelo then do fetch mensal!");
            console.log(dados);

            // Limpando o gráfico
            chartMensal.data.labels = [];
            for (var i = 0; i < chartMensal.data.datasets.length; i++) {
                chartMensal.data.datasets[i].data = [];
                chartMensal.data.datasets[i].label = undefined;
            }
            chartMensal.update();
            console.log("Gráfico mensal limpo.");

            // definindo variavel de meses
            var meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

            // definindo variaveis para atribuir os dados separadamente
            var ano = [];
            var mes = [];
            var componente = [];
            var alertas = [];

            // for para adicionar os alertas no grafico
            for (var i = 0; i < dados.length; i++) {
                var alerta = dados[i];
                ano.push(alerta.Ano);

                // verificando se o mes ja foi atribuido, caso não foi atribui ele para o grafico
                var nomeMes = meses[alerta.Mes - 1];
                if (!mes.includes(nomeMes)) {
                    mes.push(nomeMes);
                }

                // for para verificar separadamente os componentes de cada mes, e adicionando o valor do componente atual
                for (var j = 0; j < chartMensal.data.datasets.length; j++) {
                    if (chartMensal.data.datasets[j].label === undefined) {
                        chartMensal.data.datasets[j].label = alerta.Componente;
                        chartMensal.data.datasets[j].data.push(alerta.total_alertas);
                        break;
                    } else if (chartMensal.data.datasets[j].label === alerta.Componente) {
                        chartMensal.data.datasets[j].data.push(alerta.total_alertas);
                        break;
                    }
                }
            }

            console.log(ano);
            console.log(mes);
            console.log(componente);
            console.log(alertas);

            chartMensal.data.labels = mes;
            chartMensal.update('none');

            for(var i = 0; i < chartFiliais.data.labels.length; i++){
                if (chartFiliais.data.ids[i] == ids) {

                    div_mensal.innerHTML = `Alertas Mensais <b> ${chartFiliais.data.labels[i]} </b> (Últimos 6 meses)`;
                    titulo_geral.innerHTML = `Total de alertas por componente <b>${chartFiliais.data.labels[i]}</b>`;
                    break;
                }
            }

            for (var i = 0; i < chartMensal.data.datasets.length; i++) {

                if(chartMensal.data.datasets[i].label == "Processador"){
                    chartMensal.data.datasets[i].label = "CPU";
                }
                if(chartMensal.data.datasets[i].label == "Armazenamento"){
                    chartMensal.data.datasets[i].label = "Disco";
                }

                if(!chartMensal.data.datasets[i].label){
                    chartMensal.data.datasets[i].label = "sem dados";
                }

                if(i === 0 && chartMensal.data.datasets[i].label != "sem dados"){
                    chartMensal.data.datasets[i].backgroundColor = '#DE2828';
                }
                if(i === 1 && chartMensal.data.datasets[i].label != "sem dados"){
                    chartMensal.data.datasets[i].backgroundColor = '#de6528';
                }
                if(i === 2 && chartMensal.data.datasets[i].label != "sem dados"){
                    chartMensal.data.datasets[i].backgroundColor = '#DEC828';
                }
                if(i === 3 && chartMensal.data.datasets[i].label != "sem dados"){
                    chartMensal.data.datasets[i].backgroundColor = '#5271FF';
                }

            }
            chartMensal.update();

            trocarKpi(clientefk,ids);
        }).catch((erro) => {
                console.error("Erro no retorno do mensal:", erro);
        });
    }else{
       console.log("erro ao trocar grafico mensal") 
    }
}

function trocarKpi(clientefk,id){
    var clientefk = sessionStorage.fkCliente;
    fetch("/marcolino/trocarKpi", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fkClienteServer: clientefk,
            fkFilialServer : id,
        })
    }).then((resposta) => resposta.json())
    .then((dados) => {
        console.log("passei pelo then do fatch de trocar KPI's!");
        console.log(dados);

        var mensagem = "";
        var label = 0;
        var CPU = false;
        var RAM = false;
        var Disco = false;
        var Rede = false;

        for(var i = 0; i < dados.length; i++){
            var alertas = dados[i];
            var componente = alertas.componente;
            var qtdAlertas = alertas.total_alertas;

            if(componente == "Processador"){
                componente = "CPU"
                CPU = true;
            }else if(componente == "Armazenamento"){
                componente = "Disco"
                Disco = true;
            }else if(componente == "Rede"){
                Rede = true;
            }else if(componente == "RAM"){
                RAM = true;
            }

            var bgColor = "";
            if(i === 0){
                bgColor = ` style="background-color: #DE2828 !important;border-radius: 10px !important;"`;
                chartMensal.data.datasets[i].backgroundColor = '#DE2828';
            }
            if(i === 1){
                bgColor = ` style="background-color: #de6528 !important;border-radius: 10px !important;"`
                chartMensal.data.datasets[i].backgroundColor = '#de6528';
            }
            if(i === 2){
                bgColor = ` style="background-color: #DEC828 !important;border-radius: 10px !important;"`
                chartMensal.data.datasets[i].backgroundColor = '#DEC828';
            }
            if(i === 3){
                bgColor = ` style="background-color: #5271FF !important;border-radius: 10px !important;"`
                chartMensal.data.datasets[i].backgroundColor = '#5271FF';
            }
            mensagem +=`
                        <div class="col-sm-6 col-md-3">
                            <div class="card-alert p-5"${bgColor} style="border-radius: 10px !important;">
                                <h3 class="borda">Total - Alertas de ${componente}</h3>
                                <h1>${qtdAlertas}</h1>
                            </div>
                        </div>
            `;
            label++;
        }
        div_kpis.innerHTML = "";
        div_kpis.innerHTML = mensagem;
    }).catch((erro) => {
            console.error("Erro no retorno das trocas de filiais:", erro);
    });
}

function mostrar(){
    plotarkpi();
    plotarMensal();
    plotarFilial();
}

function plotarkpi(){

    var clientefk = sessionStorage.fkCliente;
    fetch("/marcolino/plotarKpi", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fkClienteServer: clientefk,
        })
    }).then((resposta) => resposta.json())
    .then((dados) => {
        console.log("passei pelo then do fatch das KPI's!");
        console.log(dados);

        var mensagem = "";

        for(var i = 0; i < dados.length; i++){
            var alertas = dados[i];
            var componente = alertas.componente;
            var qtdAlertas = alertas.total_alertas;
            
            if(componente == "Processador"){
                componente = "CPU"
            }
            if(componente == "Armazenamento"){
                componente = "Disco"
            }
            
            var bgColor = "";
            if(i === 0){
                bgColor = ` style="background-color: #DE2828 !important;border-radius: 10px !important;"`;
                chartMensal.data.datasets[i].backgroundColor = '#DE2828';
            }
            if(i === 1){
                bgColor = ` style="background-color: #de6528 !important;border-radius: 10px !important;"`
                chartMensal.data.datasets[i].backgroundColor = '#de6528';
            }
            if(i === 2){
                bgColor = ` style="background-color: #DEC828 !important;border-radius: 10px !important;"`
                chartMensal.data.datasets[i].backgroundColor = '#DEC828';
            }
            if(i === 3){
                bgColor = ` style="background-color: #5271FF !important;border-radius: 10px !important;"`
                chartMensal.data.datasets[i].backgroundColor = '#5271FF';
            }
            mensagem +=`
                        <div class="col-sm-6 col-md-3">
                            <div class="card-alert p-5"${bgColor} style="border-radius: 10px !important;">
                                <h3 class="borda">Total - Alertas de ${componente}</h3>
                                <h1>${qtdAlertas}</h1>
                            </div>
                        </div>
            `;
        }
        div_kpis.innerHTML = mensagem;
    }).catch((erro) => {
            console.error("Erro no retorno das filiais:", erro);
    });

}

function plotarMensal(){

    var clientefk = sessionStorage.fkCliente;
    garficoFilial = false;

    fetch("/marcolino/plotarMensal", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fkClienteServer: clientefk,
        })
    }).then((resposta) => resposta.json())
    .then((dados) => {
    console.log("passei pelo then do fetch mensal!");
    console.log(dados);

    // Limpando o gráfico
    chartMensal.data.labels = [];
    for (var i = 0; i < chartMensal.data.datasets.length; i++) {
        chartMensal.data.datasets[i].data = [];
        chartMensal.data.datasets[i].label = undefined;
    }

    // atribuindo meses para uma array
    var meses = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
                "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

    var mes = [];
    var ano = [];
    var componente = [];
    var alertas = [];

    // for para adicionar os alertas, verificando primeiro os meses dos dados
    for (var i = 0; i < dados.length; i++) {
        var alerta = dados[i];
        ano.push(alerta.Ano);

        // verificando se o mes atual ja esta adicionado
        var mes_atual = meses[alerta.Mes - 1];
        if (!mes.includes(mes_atual)) {
            mes.push(mes_atual);
        }

        // for para adicionar os componentes e os valores deles no mes atual
        for (var j = 0; j < chartMensal.data.datasets.length; j++) {
            if(alerta.Componente == "Processador"){
                alerta.Componente = "CPU"
            }
            if(alerta.Componente == "Armazenamento"){
                alerta.Componente = "Disco"
            }
            if (chartMensal.data.datasets[j].label === undefined) {
                chartMensal.data.datasets[j].label = alerta.Componente;
                chartMensal.data.datasets[j].data.push(alerta.total_alertas);
                break;
            } else if (chartMensal.data.datasets[j].label === alerta.Componente) {
                chartMensal.data.datasets[j].data.push(alerta.total_alertas);
                break;
            }
        }
    }
    // definindo cores das barras
    // for(var i = 0;i < chartMensal.data.datasets.length ;i++){
    //     if(chartMensal.data.datasets[i].label == "CPU"){
    //         chartMensal.data.datasets[i].backgroundColor = '#69D7FF';
    //     }else if(chartMensal.data.datasets[i].label == "Disco"){
    //         chartMensal.data.datasets[i].backgroundColor = '#E9A276';
    //     }else if(chartMensal.data.datasets[i].label == "RAM"){
    //         chartMensal.data.datasets[i].backgroundColor = '#FF8CA5';
    //     }else if(chartMensal.data.datasets[i].label == "Rede"){
    //         chartMensal.data.datasets[i].backgroundColor = '#D794FE';
    //     }
    // }

    chartMensal.data.labels = mes;
    chartMensal.update();
    
    for (var i = 0; i < chartMensal.data.datasets.length; i++) {
        if(!chartMensal.data.datasets[i].label){
            chartMensal.data.datasets[i].label = "sem dados"
        }
    }
    chartMensal.update();
    div_mensal.innerHTML = `Alertas Mensais (Últimos 6 meses)`;
    titulo_geral.innerHTML = `Total de alertas gerais por componente`;
    console.log(ano);
    console.log(mes);
    console.log(componente);
    console.log(alertas);
    console.log(componente.includes("RAM"));
    }).catch((erro) => {
            console.error("Erro no retorno do mensal:", erro);
    });
}

function plotarFilial(){
    var clientefk = sessionStorage.fkCliente;
    fetch("/marcolino/plotarFilial", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fkClienteServer: clientefk,
        })
    }).then((resposta) => resposta.json())
    .then((dados) => {
        console.log("passei pelo then do fatch das filiais!");
        console.log(dados);

        var filiais = [];
        var alertas = [];
        var ids = [];
        
        for(var i = 0; i < dados.length; i++){
            var filial = dados[i];
            var filialMin = filial.terminal;
            var complementoMin = filial.complemento;

            filialMin = filialMin.toLowerCase();
            complementoMin = complementoMin.toLowerCase();

            if(filialMin == complementoMin){
                filiais.push(filial.terminal);
            }else{
                filiais.push(filial.terminal+" - "+filial.complemento);
            }

            ids.push(filial.idFilial)
            alertas.push(filial.total_alertas);
            // if(filial.total_alertas >=0 && filial.total_alertas <= 1000){
            //     cores.push("green");
            // }else if(filial.total_alertas > 1000 && filial.total_alertas <= 2000){
            //     cores.push("#e6e604");
            // }else if(filial.total_alertas > 3000){
            //     cores.push("red");
            // }
        }

        chartFiliais.data.ids = ids; 
        chartFiliais.data.labels = filiais; 
        chartFiliais.data.datasets[0].data = alertas;
        // chartFiliais.data.datasets[0].backgroundColor = cores;
        chartFiliais.update();
    }).catch((erro) => {
            console.error("Erro no retorno das filiais:", erro);
    });
}










function iniciarAtualizacaoAutomatica() {
    if (atualizar !== null) return;

    atualizar = setInterval(() => {
        console.log("Atualizando os gráficos automaticamente...");
        
        if (!garficoFilial) { // Se garficoFilial for false, chama plotarMensal
            if (typeof plotarMensal === 'function') plotarMensal();
            if (typeof plotarkpi === 'function') plotarkpi();
        } else {
            // Se garficoFilial for true, tenta chamar trocarMensal para a filial da sessão
            const idFilialDaSessao = sessionStorage.filial;

            if (idFilialDaSessao && idFilialDaSessao !== '0') { // Verifica se temos um ID de filial válido na sessão
                // Pré-requisito: chartFiliais e seus dados devem estar disponíveis e populados neste momento.
                if (typeof chartFiliais !== 'undefined' && chartFiliais.data && Array.isArray(chartFiliais.data.ids) && Array.isArray(chartFiliais.data.labels)) {
                    
                    // Encontra o índice do idFilialDaSessao em chartFiliais.data.ids
                    // Importante: sessionStorage armazena strings. Ajuste a comparação se os IDs em chartFiliais.data.ids forem números.
                    const targetIdString = String(idFilialDaSessao);
                    let foundIndex = -1;

                    for (let i = 0; i < chartFiliais.data.ids.length; i++) {
                        if (String(chartFiliais.data.ids[i]) === targetIdString) {
                            foundIndex = i;
                            break;
                        }
                    }

                    if (foundIndex !== -1) {
                        // Cria a estrutura 'elements' simulada
                        const mockedElements = [{
                            index: foundIndex
                            // A função trocarMensal também acessa chartFiliais.data.labels[firstElement.index]
                            // Se essa label for importante, certifique-se que chartFiliais.data.labels[foundIndex] existe.
                        }];

                        console.log(`Chamando trocarMensal para atualização automática com ID: ${idFilialDaSessao} (índice encontrado: ${foundIndex})`);
                        trocarMensal(null, mockedElements); // Chama a função original com os 'elements' simulados
                    } else {
                        console.warn(`ID da filial '${idFilialDaSessao}' (da sessionStorage) não encontrado em chartFiliais.data.ids. Não foi possível chamar trocarMensal automaticamente.`);
                        // Fallback: talvez chamar plotarMensal() ou outra lógica
                        if (typeof plotarMensal === 'function') plotarMensal();
                    }
                } else {
                    console.warn("Não foi possível preparar a chamada para trocarMensal: 'chartFiliais' ou seus dados (ids, labels) não estão disponíveis ou no formato esperado.");
                    // Fallback
                    if (typeof plotarMensal === 'function') plotarMensal();
                }
            } else {
                console.log("Atualização automática: Nenhuma filial específica na sessão (sessionStorage.filial não é um ID válido). Chamando plotarMensal geral.");
                if (typeof plotarMensal === 'function') plotarMensal();
            }
        }

        if (typeof plotarFilial === 'function') plotarFilial();

        const agora = new Date();
        const horas = agora.getHours().toString().padStart(2, '0');
        const minutos = agora.getMinutes().toString().padStart(2, '0');
        const segundos = agora.getSeconds().toString().padStart(2, '0');

        div_attFilial.innerHTML = `<b>Atualizado em: ${horas}:${minutos}:${segundos}</b>`;
        div_attMensal.innerHTML = `<b>Atualizado em: ${horas}:${minutos}:${segundos}</b>`;
    }, 4000);
}

function pararAtualizacaoAutomatica() {
    if (atualizar !== null) {
        clearInterval(atualizar);
        atualizar = null;
        console.log("Atualização automática interrompida.");
    }
}