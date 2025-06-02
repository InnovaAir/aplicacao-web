let chartMensal;
let chartFiliais;

function gerarGraficos(){
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
                backgroundColor: '#2e8b57',
                // data: [5, 3, 4, 7, 9, 5],
                hidden: false },
            {
                // label: 'RAM',
                backgroundColor: '#5f9ea0',
                // data: [1, 1, 4, 1, 2, 2],
                hidden: true },
            {
                // label: 'Disco',
                backgroundColor: '#f4c542',
                // data: [2, 4, 4, 4, 3, 2],
                hidden: true },
            {
                // label: 'REDE',
                backgroundColor: '#8a2be2',
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
            suggestedMax: 100
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
                // 'green', '#e6e604', 'red', 'red', '#e6e604', '#e6e604', 'red', '#e6e604'
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
                color: '#ffffff',
                font: { weight: 'bold', size: 20 }
            },
            legend: {
                position: 'top',
                labels: {
                    generateLabels: function(chart) {
                        return [
                            { text: 'OK (0 - 20)', fillStyle: 'green', strokeStyle: '#000', lineWidth: 1 },
                            { text: 'Atenção (21 - 50)', fillStyle: '#e6e604', strokeStyle: '#000', lineWidth: 1 },
                            { text: 'Crítico (51 - ~)', fillStyle: 'red', strokeStyle: '#000', lineWidth: 1 }
                        ];
                    }
                }
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

        var clientefk = sessionStorage.fkCliente;

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
            chartMensal.update();
        }).catch((erro) => {
                console.error("Erro no retorno do mensal:", erro);
        });
    }else{
       console.log("erro ao trocar grafico mensal") 
    }
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
            var cor = "";

            if(componente == "Processador"){
                componente = "CPU"
            }

            if(i === 0){
                cor = ` style="background-color: red !important;"`
            }
            mensagem +=`
                        <div class="col-sm-6 col-md-3">
                            <div class="card-alert"${cor}>
                                <h5>Alertas de ${componente}</h5>
                                <h2>${qtdAlertas}</h2>
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

    chartMensal.data.labels = mes;
    chartMensal.update();

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
        var cores = [];
        var ids = [];

        for(var i = 0; i < dados.length; i++){
            var filial = dados[i];
            ids.push(filial.idFilial)
            filiais.push(filial.terminal);
            alertas.push(filial.total_alertas);
            if(filial.total_alertas >=0 && filial.total_alertas <= 20){
                cores.push("green");
            }else if(filial.total_alertas > 20 && filial.total_alertas <= 50){
                cores.push("#e6e604");
            }else if(filial.total_alertas > 50){
                cores.push("red");
            }
        }

        chartFiliais.data.ids = ids; 
        chartFiliais.data.labels = filiais; 
        chartFiliais.data.datasets[0].data = alertas;
        chartFiliais.data.datasets[0].backgroundColor = cores;
        chartFiliais.update(); 
    }).catch((erro) => {
            console.error("Erro no retorno das filiais:", erro);
    });
}