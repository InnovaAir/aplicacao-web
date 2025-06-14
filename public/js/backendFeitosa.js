
var totensAlerta = 0;
var totensOciosos = 0;
var totensNormal = 0;
var totensDesligados = 0;

var alertasCPU = 0;
var alertasRAM = 0;
var alertasDISCO = 0;
var alertasREDE = 0;

var firstTime = true;


var enderecos_usuario = []

function getEnderecosUsuario(idUsuario) {
    fetch(`/usuarios/enderecos/${idUsuario}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((answer) => {
            answer.json().then((json) => {
                html_message = `<option selected value="all">Todos os aeroportos</option>`;

                var arrayIDs = []
                var arrayEnderecos = []

                json.forEach(endereco => {
                    arrayEnderecos.push(endereco);
                    arrayIDs.push(endereco.idEndereco);

                    html_message += `<option value="${endereco.idEndereco}/${endereco.complemento}">${endereco.complemento} - ${endereco.estado}</option>`;
                });
                enderecos_usuario.push(arrayIDs)
                enderecos_usuario.push(arrayEnderecos)


                document.getElementById("select_endereco").innerHTML = html_message;
                getConcluido = true;
            })
        })
}

async function plotarListaMaquinas(selection) {
    const nowDatetime = await getDatetime()
    const list_totem = document.getElementById("lines")

    var aeroporto = selection.split("/")[1]
    selection = selection.split("/")[0]

    console.log(aeroporto)
    console.log(selection)

    var arrayExibicaoTotens = [];

    const response = await fetch("/dados/array", {
        method: "GET", headers: { "Content-Type": "application/json" }
    })

    const json = await response.json();

    // Loop para adicionar todos totens em um array (que o usuario quer ver) para ordenação
    for (let i = 0; i < json.length; i++) {
        const endereco = json[i];

        enderecos_usuario[1].forEach(endereco => {
            endereco.totalAlertas = 0;
        });

        if (selection == "all") {
            // Todos os endereços
            if (enderecos_usuario[0].includes(endereco.idEndereco)) {

                // Verificar se os endereços do usuário é o atual do for
                /* Por que? -> Para pegar os totens e inseri-los na lista de exibição */
                endereco.totens.forEach(totem => {
                    totem.prioridade = -10;
                    totem.idEndereco = endereco.idEndereco
                    // Adiciona todos totens do endereço que possui acesso na lista de exibição
                    arrayExibicaoTotens.push(totem);
                });
            }
        }
        else if (selection != "all") {
            // Endereço Específico
            if (endereco.idEndereco == selection) {
                // Adiciona os totens do endereço especifico na lista de exibição
                endereco.totens.forEach(totem => {
                    totem.prioridade = -10;
                    totem.idEndereco = endereco.idEndereco
                    arrayExibicaoTotens.push(totem);
                })
            }
        }
    }

    /* TABELA DE PRIORIDADE DA LISTA:*/
    // 99 -> CRITICO
    // 50 -> ALTO
    // 10 -> BAIXO
    // 0 -> NORMAL
    // -10 -> OCIOSO

    // Define a pontuação de Priorização
    arrayExibicaoTotens.forEach(async totem => {

        var pontuacao = 0;
        var totalAlertas = 0;

        totem.turnedOFF = false;

        var momento = totem.momento[totem.momento.length - 1];

        if (momento != undefined) {
            const datetimeData = new Date(momento);
            const datetimeNow = new Date(); // ou new Date(nowDatetime) se você tiver a variável
            const diferencaMinutos = Math.floor((datetimeNow.getTime() - datetimeData.getTime()) / (1000 * 60));

            if (diferencaMinutos >= 15) {
                // Está desligado
                totem.turnedOFF = true;
            } else {
                // Está ligado
                var cpu = totem.dados.cpu[totem.dados.cpu.length - 1];
                var ram = totem.dados.ram[totem.dados.ram.length - 1];
                var disco = totem.dados.disco[totem.dados.disco.length - 1];
                var rede = (totem.dados.rede[totem.dados.rede.length - 1]) / 1024 / 1024;

                var limiteMinCPU = totem.metricas.cpu.minimo
                var MedianaCPU = Math.round((totem.metricas.cpu.maximo + totem.metricas.cpu.minimo) / 2, 1)
                var limiteMaxCPU = totem.metricas.cpu.maximo

                var limiteMinRAM = totem.metricas.ram.minimo
                var MedianaRAM = Math.round((totem.metricas.ram.maximo + totem.metricas.ram.minimo) / 2, 1)
                var limiteMaxRAM = totem.metricas.ram.maximo

                var limiteMinDISCO = totem.metricas.disco.minimo
                var MedianaDISCO = Math.round((totem.metricas.disco.maximo + totem.metricas.disco.minimo) / 2, 1)
                var limiteMaxDISCO = totem.metricas.disco.maximo

                var limiteMinREDE = totem.metricas.rede.minimo
                var MedianaREDE = Math.round((totem.metricas.rede.maximo + totem.metricas.rede.minimo) / 2, 1)
                var limiteMaxREDE = totem.metricas.rede.maximo

                var isIdle = false, isOnAlert = false;
                var cpu_color, ram_color, disco_color, rede_color;

                // Definição das pontuação de crítico, alto, baixo e estado (alerta, normal ou ociosa)
                if (cpu > limiteMaxCPU) { cpu_color = "ball-purple"; pontuacao += 99; isOnAlert = true; totalAlertas++; alertasCPU++ }
                else if (cpu > MedianaCPU && cpu <= limiteMaxCPU) { pontuacao += 50; isOnAlert = true; cpu_color = "ball-red"; totalAlertas++; alertasCPU++ }
                else if (cpu > limiteMinCPU && cpu <= MedianaCPU) { pontuacao += 20; cpu_color = "ball-yellow" }
                else if (cpu <= 10) { cpu_color = "ball-green"; pontuacao += -10; isIdle = true }
                else { cpu_color = "ball-green"; pontuacao += 1; }

                if (ram > limiteMaxRAM) { pontuacao += 99; isOnAlert = true; ram_color = "ball-purple"; totalAlertas++; alertasRAM++ }
                else if (ram > MedianaRAM && ram <= limiteMaxRAM) { pontuacao += 50; isOnAlert = true; ram_color = "ball-red"; totalAlertas++; alertasRAM++ }
                else if (ram > limiteMinRAM && ram <= MedianaRAM) { pontuacao += 20; ram_color = "ball-yellow" }
                else { ram_color = "ball-green"; pontuacao += 1; }

                if (disco > limiteMaxDISCO) { pontuacao += 99; isOnAlert = true; disco_color = "ball-purple"; totalAlertas++; alertasDISCO++ }
                else if (disco > MedianaDISCO && disco <= limiteMaxDISCO) { pontuacao += 50; isOnAlert = true; disco_color = "ball-red"; totalAlertas++; alertasDISCO++ }
                else if (disco > limiteMinDISCO && disco <= MedianaDISCO) { pontuacao += 20; disco_color = "ball-yellow" }
                else { disco_color = "ball-green"; pontuacao += 1; }

                // A lógica de rede estar pior é o reverso, sendo assim, necessário outra lógica
                if (rede < limiteMaxREDE) { pontuacao += 99; isOnAlert = true; rede_color = "ball-purple"; totalAlertas++; alertasREDE++ }
                else if (rede >= limiteMaxREDE && rede < MedianaREDE) { pontuacao += 50; isOnAlert = true; rede_color = "ball-red"; totalAlertas++; alertasREDE++ }
                else if (rede >= MedianaREDE && rede <= limiteMinREDE) { pontuacao += 20; rede_color = "ball-yellow" }
                else { rede_color = "ball-green"; pontuacao += 1; }

                // Totem está ocioso e não está em alerta
                if (isIdle && !isOnAlert) { isIdle = 'blue'; totensOciosos++ }
                // Totem está ocioso e em alerta
                else if (isIdle && isOnAlert) { isOnAlert = 'red'; isIdle = ''; totensAlerta++ }
                // Totem está em alerta
                else if (isOnAlert && isIdle == false) { isOnAlert = 'red'; totensAlerta++; }
                // Totem está normal
                else { isOnAlert = 'green'; isIdle = '' }

                enderecos_usuario[1].forEach(endereco => {
                    if (endereco.idEndereco == totem.idEndereco) {
                        endereco.totalAlertas += totalAlertas;
                    }
                });

                if (pontuacao != 0) {
                    totem.prioridade = pontuacao;
                }

                totem.status = { "idle": isIdle, "alert": isOnAlert, colors: { "cpu": cpu_color, "ram": ram_color, "disco": disco_color, "rede": rede_color } }
            }
        }
    })

    const response1 = await fetch("/jira/buscarChamados", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            jql: "created >= startOfDay() AND resolution IS EMPTY"
        })
    });

    const json1 = await response1.json();
    const chamados = await json1.issues;

    var totalChamadosEnderecos = 0;


    if (selection == "All") {
        chamados.forEach(chamado => {
            var aeroportoChamado = chamado.fields.summary.split("(")[1].split("/")[0]

            enderecos_usuario[1].forEach(enderecoAtual => {
                if (aeroportoChamado == enderecoAtual.complemento) {
                    totalChamadosEnderecos++
                }
            })
        });
    } else {
        chamados.forEach(chamado => {
            var aeroportoChamado = chamado.fields.summary.split("(")[1].split("/")[0]

            if (aeroportoChamado == aeroporto) {
                totalChamadosEnderecos++;
            }
        });
    }

    document.getElementById("indicator_chamados_abertos").innerHTML = totalChamadosEnderecos;

    arrayExibicaoTotens.sort((a, b) => b.prioridade - a.prioridade);

    var listTotensHtml = "";

    arrayExibicaoTotens.forEach(totem => {
        var hostname = totem.hostname;

        var percent_cpu = totem.dados.cpu[totem.dados.cpu.length - 1];
        var percent_ram = totem.dados.ram[totem.dados.ram.length - 1];
        var percent_disco = totem.dados.disco[totem.dados.disco.length - 1];
        var download_rede = Math.round(totem.dados.rede[totem.dados.rede.length - 1] / 1024, 1);

        var rede_name = "kbps";

        if (download_rede > 1000) {
            download_rede = Math.ceil(download_rede / 1024);
            rede_name = "Mb";
        }

        // Se não há dados sendo recbeidos de qualquer componente, a maquina está desligada
        if (percent_cpu == undefined) { percent_cpu = "N/A"; totem.turnedOFF = true }
        if (percent_ram == undefined) { percent_cpu = "N/A"; totem.turnedOFF = true }
        if (percent_disco == undefined) { percent_cpu = "N/A"; totem.turnedOFF = true }
        if (download_rede == undefined) { percent_cpu = "N/A"; totem.turnedOFF = true }

        if (totem.turnedOFF) {
            totensDesligados++

            listTotensHtml += `
                        <div class="totem">
                            <span>${hostname}</span>  
                            <div class="box">
                                <div class="ball"></div>
                                <span>N/A</span>
                            </div>
                            <div class="box">
                                <div class="ball"></div>
                                <span>N/A</span>
                            </div>
                            <div class="box">
                                <div class="ball"></div>
                                <span>N/A</span>
                            </div>
                            <div class="box">
                                <div class="ball"></div>
                                <span>N/A</span>
                            </div>
                        </div>
                    `
        } else {
            var alert = totem.status.alert
            var idle = totem.status.idle

            totem.redename = rede_name;

            var color_cpu = totem.status.colors.cpu
            var color_ram = totem.status.colors.ram
            var color_disco = totem.status.colors.disco
            var color_rede = totem.status.colors.rede

            const totalAlertas = 1;

            listTotensHtml += `
                        <div class="totem ${idle} ${alert}">
                            <span>${hostname}</span>
                            <div class="box">
                                <div class="${color_cpu} ball"></div>
                                <span>${percent_cpu}%</span>
                            </div>
                            <div class="box">
                                <div class="${color_ram} ball"></div>
                                <span>${percent_ram}%</span>
                            </div>
                            <div class="box">
                                <div class="${color_disco} ball"></div>
                                <span>${percent_disco}%</span>
                            </div>
                            <div class="box">
                                <div class="${color_rede} ball"></div>
                                <span>${download_rede}${rede_name}</span>
                            </div>
                            <button style="cursor: pointer;" data-totem='${JSON.stringify(totem)}' onclick="openDashboardDisplay(this.dataset.totem)">Analisar</button>
                        </div>
                    `;
        }
    });

    totensNormal = arrayExibicaoTotens.length - (totensAlerta + totensDesligados + totensOciosos);

    list_totem.innerHTML = listTotensHtml;

    atualizarGraficoTempoReal();

    getEnderecoMaisAlerta()

    alertasCPU = 0;
    alertasRAM = 0;
    alertasDISCO = 0;
    alertasREDE = 0;

    getKPIs()
};

function getEnderecoMaisAlerta() {
    var indexMaior = -1;
    let maiorValor = 0;

    for (let i = 0; i < enderecos_usuario[1].length; i++) {
        const enderecoAtual = enderecos_usuario[1][i];

        if (enderecoAtual.totalAlertas > maiorValor) {
            maiorValor = enderecoAtual.totalAlertas;
            indexMaior = i;
        }
    }

    var kpi_endereco = document.getElementById("indicator_address");

    if (indexMaior == -1) {
        kpi_endereco.innerHTML = "Todos estáveis"
    } else {
        kpi_endereco.innerHTML = `${enderecos_usuario[1][indexMaior].complemento} - ${enderecos_usuario[1][indexMaior].estado}`;
    }
}

function getKPIs() {
    var kpi_alerta = document.getElementById("indicator_alert")
    var kpi_normal = document.getElementById("indicator_activity")
    var kpi_ocioso = document.getElementById("indicator_idle")
    var kpi_off = document.getElementById("indicator_off")

    kpi_alerta.innerHTML = ""
    kpi_normal.innerHTML = ""
    kpi_ocioso.innerHTML = ""

    kpi_alerta.innerHTML = totensAlerta;
    kpi_normal.innerHTML = totensNormal;
    kpi_ocioso.innerHTML = totensOciosos;
    kpi_off.innerHTML = totensDesligados;

    totensAlerta = 0;
    totensNormal = 0;
    totensOciosos = 0;
    totensDesligados = 0;
}

async function getAlertas(idMaquina) {
    try {
        const response = await fetch(`/dados/totalAlertas/today/${idMaquina}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const json = await response.json();
        const total = json[0].total;
        return total; // Retorna o valor

    } catch (error) {
        console.error('Erro na requisição:', error);
        return null; // ou throw error
    }
}



async function getDatetime() {
    const dataHoraAtual = new Date();
    const ano = dataHoraAtual.getFullYear();
    const mes = dataHoraAtual.getMonth() + 1;
    const dia = dataHoraAtual.getDate();
    const hora = dataHoraAtual.getHours();
    const minuto = dataHoraAtual.getMinutes();
    const segundo = dataHoraAtual.getSeconds();
    const datetime = `${dia}/${mes}/${ano} ${hora}:${minuto}:${segundo}`;

    return datetime;
}

function openDashboardDisplay(totemData) {
    /* Define em json o parametro dos dados do totem */
    const totem = JSON.parse(totemData);

    arrayRede = []
    totem.dados.rede.forEach(dado => { dado = Math.floor(dado / 1024 / 1024); arrayRede.push(dado) });
    totem.dados.rede = arrayRede

    console.log(arrayRede)
    console.log(totem.dados.rede)

    /* Graficos de Linha */
    var optionsCPU_line = criarOptionLine(totem.dados.cpu, totem.momento);
    var optionsRAM_line = criarOptionLine(totem.dados.ram, totem.momento);
    var optionsDISCO_line = criarOptionLine(totem.dados.disco, totem.momento);
    var optionsREDE_line = criarOptionLine(totem.dados.rede, totem.momento);

    var chartCPU_line = new ApexCharts(document.getElementById("chart-cpu"), optionsCPU_line);
    var chartRAM_line = new ApexCharts(document.getElementById("chart-ram"), optionsRAM_line);
    var chartDISCO_line = new ApexCharts(document.getElementById("chart-disco"), optionsDISCO_line);
    var chartREDE_line = new ApexCharts(document.getElementById("chart-rede"), optionsREDE_line);

    /* Renderizando os gráficos de linha */
    chartCPU_line.render();
    chartRAM_line.render();
    chartDISCO_line.render();
    chartREDE_line.render();

    /* Variaveis dos Dados */
    var ultimo_dado_cpu = totem.dados.cpu[totem.dados.cpu.length - 1]
    var ultimo_dado_ram = totem.dados.ram[totem.dados.ram.length - 1]
    var ultimo_dado_disco = totem.dados.disco[totem.dados.disco.length - 1]
    var ultimo_dado_rede = totem.dados.rede[totem.dados.rede.length - 1]

    console.log(totem.dados.rede[totem.dados.rede.length - 1])
    console.log(ultimo_dado_rede)
    /* Grafico de Status */
    var optionsCPU_status = atualizarOptionStatus(ultimo_dado_cpu, totem.metricas.cpu, "cpu");
    var optionsRAM_status = atualizarOptionStatus(ultimo_dado_ram, totem.metricas.ram, "ram");
    var optionsDISCO_status = atualizarOptionStatus(ultimo_dado_disco, totem.metricas.disco, "disco");
    var optionsREDE_status = atualizarOptionStatus(ultimo_dado_rede, totem.metricas.rede, "rede", totem.redename);

    /* Abre a tela */
    document.getElementById("analise_frame").style.display = 'flex';
    document.getElementById("main_frame").style.display = 'none';

    console.log(totem.hostname)
    obterChamadosJira(totem.hostname)

    const tempo = getTempoAtividade(totem.tempoAtivo);

    /* Exibindo as informações nas KPI's */
    document.getElementById("nome_totem").innerHTML = totem.hostname;
    document.getElementById("tempo_atividade_totem").innerHTML = `${tempo}`;
    document.getElementById("mac_totem").innerHTML = totem.enderecoMac;

    var processHTML = ``;

    /* Plotando os logs de processo */
    totem.processos.forEach(processo => {
        var nome = processo[0].ProcessName;
        var cpu = processo[1]["CPU(s)"];
        var ram = processo[2]["Memory(MB)"];
        var tempo = processo[3]["Uptime"].split(".")[0];
        var id = processo[4]["Id"];

        processHTML += `
        <div class="dataLine">
            <span>${nome}</span>
            <span>${Math.floor(Number(cpu.split(",")[0]) / 60)} Minutos</span>
            <span>${ram}Mb</span>
            <span>${tempo}</span>
            <span>${id}</span> 
        </div>`;
    })

    document.getElementById("processos_maquina").innerHTML = processHTML;
};

function atualizarOptionStatus(data, metricas, componente, redename) {


    var componenteNome = componente.toUpperCase();

    var simbol = '%'

    if (componente == "rede") {
        if (redename != undefined) {
            if (redename == "Mb") {
                simbol = 'Mb'
            } else {
                simbol = "Kbps"
            }
        }
    }

    var color = "#33A100"

    if (metricas.maximo != null) {

        if (data > metricas.maximo) {
            color = "#8537C8"

        } if (data <= metricas.maximo && data > ((metricas.maximo + metricas.minimo) / 2)) {
            color = "#DE2828"

        } else if (data > metricas.minimo && data <= ((metricas.maximo + metricas.minimo) / 2)) {
            color = "#DEC828"
        }
    }


    ApexCharts.exec(`chart-${componente}-status`, 'updateOptions', {
        series: [data],
        fill: {
            colors: [color]
        },
        labels: [componenteNome]
    });
}

function criarOptionStatus(componente) {
    var simbol = '%'

    if (componente == "rede") {
        simbol = 'Mb'
    }

    return {
        series: [0],
        chart: {
            id: `chart-${componente}-status`,
            height: 200,
            type: 'radialBar',
            background: 'transparent'
        },
        plotOptions: {
            radialBar: {
                startAngle: -135,
                endAngle: 135,
                hollow: {
                    margin: 0,
                    size: '70%',
                    background: 'transparent',
                },
                track: {
                    background: '#333',
                    strokeWidth: '67%',
                    margin: 0,
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        offsetY: 10,
                        fontSize: '28px',
                        color: '#000',
                        fontWeight: 'bold',
                        formatter: function (val) {
                            return val + simbol;
                        }
                    }
                }
            }
        },
        fill: {
            colors: ['#000000']
        },
        stroke: {
            lineCap: 'round'
        },
        labels: [componente],
    };
}

function criarOptionLine(data, momento, maxY = 100) {
    return {
        series: [{
            data: data
        }],
        chart: {
            id: 'realtime',
            type: 'line',
            width: '100%',
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: 250
                }
            },
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },
        stroke: {
            curve: 'smooth',
            width: 5
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 4,
            hover: {
                sizeOffset: 4
            }
        },
        xaxis: {
            type: 'datetime',
            categories: momento,
            labels: {
                format: 'HH:mm:ss'
            }
        },
        yaxis: {
            min: 0,
            max: maxY
        },
        legend: {
            show: false
        }
    };
}


function getTempoAtividade(tempoAtivo) {
    var segundos = Math.floor(Math.round(tempoAtivo, 0));
    var minutos = Math.floor(segundos / 60);
    var horas = Math.floor(minutos / 60);
    var dias = Math.floor(horas / 24);
    var tempo = '';

    if (segundos < 60) {
        tempo = "Menos de 1 minuto"
    } else {
        if (minutos < 60) {
            tempo = `${minutos} minutos`
        } else {
            if (horas > 24) {
                tempo = `${dias} dias e ${horas % 24} horas`
            } else {
                tempo = `${horas} horas e ${minutos % 60} minutos`
            }
        }
    }

    return tempo;
}

function atualizarGraficoTempoReal() {
    ApexCharts.exec('chartTempoReal', 'updateSeries', [{
        name: 'Alertas',
        data: [
            alertasCPU,
            alertasDISCO,
            alertasRAM,
            alertasREDE
        ]
    }]);
    
    var alertasComponentes = [alertasCPU, alertasDISCO, alertasRAM, alertasREDE]

    var maiorValor = 0;
    var maiorIndice = -1;

    for (let i = 0; i < alertasComponentes.length; i++) {
        const alertaAtual = alertasComponentes[i];

        if (alertaAtual > maiorValor) {
            maiorValor = alertaAtual
            maiorIndice = i
        }
    }


    if (maiorIndice == -1) { maiorIndice = "Todos estáveis" } else if (maiorIndice == 0) { maiorIndice = "CPU" } else if (maiorIndice == 1) { maiorIndice = "DISCO" } else if (maiorIndice == 2) { maiorIndice = "RAM" } else { maiorIndice = "REDE" }

    document.getElementById("indicator_category").innerHTML = maiorIndice;
    document.getElementById("indicator_totalalerts").innerHTML = alertasCPU + alertasDISCO + alertasRAM + alertasREDE;
}

function closeDashboardDisplay() {
    document.getElementById("analise_frame").style.display = 'none';
    document.getElementById("main_frame").style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function expandList(div_ID) {

    var elemento = document.getElementById(div_ID);
    if (elemento.dataset.opened) {
        // Fechar
        elemento.querySelector(".line").style.display = 'none';
        elemento.querySelector(".headerContent").style.display = 'none';
        elemento.querySelector(".content").style.display = 'none';
        delete elemento.dataset.opened; // Remove o atributo
    } else {
        // Abrir
        elemento.querySelector(".line").style.display = 'flex';
        elemento.querySelector(".headerContent").style.display = 'grid';
        elemento.querySelector(".content").style.display = 'flex';
        elemento.dataset.opened = 'true'; // Adiciona o atributo
    }
}

async function obterChamadosJira(hostname) {

    const response = await fetch("/jira/buscarChamados", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            jql: "created >= startOfDay() AND resolution IS EMPTY"
        })
    });

    const json = await response.json();
    const chamados = await json.issues;

    var chamadosHTML = ``;
    var totalChamados = 0;

    chamados.forEach(chamado => {
        var dados = chamado.fields.summary.split(" ");
        var nivel = dados[0];
        var componente = dados[1];
        var totem_name = dados[3];
        var id = chamado.id;
        var momento = chamado.fields.created.split(".")[0];

        if (totem_name == hostname) {
            console.log(totem_name)
            totalChamados++;

            chamadosHTML += `
                <div class="dataLine">
                    <span>${id}</span>
                    <span>${momento}</span>
                    <span>${nivel}</span>
                    <span>${componente}</span>
                </div>`;
        }
    });

    document.getElementById("total_chamados_aberto").innerHTML = totalChamados
    document.getElementById("chamados_maquina").innerHTML = chamadosHTML
}
