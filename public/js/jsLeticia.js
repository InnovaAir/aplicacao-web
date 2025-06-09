async function atualizarGrafico() {
    var data_ram = [];
    var data_cpu = [];
    var categoria = [];
    var categoriaNum = [];

    const meses = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const componenteSelecionado = document.getElementById("select_componente").value;

    await fetch(`/dashLeticia/getAlertas`, {
        cache: 'no-store',
        method: "GET",
    }).then((resposta) => resposta.json())
        .then((json) => {
            json.forEach(info => {
                categoria.push(info.mes);
                categoriaNum.push(monthNameToNumber(info.mes));
                data_ram.push(Number(info.total_alertas_ram));
                data_cpu.push(Number(info.total_alertas_cpu));
            });
        });

    const mes = categoria[categoria.length - 1];
    const indexAtual = meses.indexOf(mes);
    const mesPrevisto = meses[(indexAtual + 1) % 12];

    // RAM
    var sumXY_ram = somar(multiplicar(categoriaNum, data_ram));
    var sumX_ram = somar(categoriaNum);
    var sumY_ram = somar(data_ram);
    var n = categoriaNum.length;
    var sumX2_ram = somar(quadrado(categoriaNum));

    var m_ram = (sumXY_ram - (sumX_ram * sumY_ram) / n) / (sumX2_ram - (sumX_ram * sumX_ram) / n);
    var b_ram = media(data_ram) - m_ram * media(categoriaNum);
    var r2_ram = (calcularR2(categoriaNum, data_ram) * 100).toFixed(1);
    var valorPrevisto = categoriaNum[categoriaNum.length - 1] + 1;
    var previsao_ram = (m_ram * valorPrevisto + b_ram).toFixed();
    if (isNaN(previsao_ram)) previsao_ram = null;

    var somaUltimos3Meses_ram = 0;
    for (var i = data_ram.length - 3; i < data_ram.length; i++) {
        if (i >= 0) somaUltimos3Meses_ram += data_ram[i];
    }

    var categoriasGrafico = [
        categoria[0] || "",
        categoria[1] || "",
        categoria[2] || "",
        mesPrevisto
    ];

    var dadosGrafico_ram = [
        data_ram[0] || 0,
        data_ram[1] || 0,
        data_ram[2] || 0,
        previsao_ram ? Number(previsao_ram) : 0
    ];

    // CPU
    var sumXY_cpu = somar(multiplicar(categoriaNum, data_cpu));
    var sumX_cpu = somar(categoriaNum);
    var sumY_cpu = somar(data_cpu);
    var sumX2_cpu = somar(quadrado(categoriaNum));

    var m_cpu = (sumXY_cpu - (sumX_cpu * sumY_cpu) / n) / (sumX2_cpu - (sumX_cpu * sumX_cpu) / n);
    var b_cpu = media(data_cpu) - m_cpu * media(categoriaNum);
    var r2_cpu = (calcularR2(categoriaNum, data_cpu) * 100).toFixed(1);
    var previsao_cpu = (m_cpu * valorPrevisto + b_cpu).toFixed();
    if (isNaN(previsao_cpu)) previsao_cpu = null;

    var somaUltimos3Meses_cpu = 0;
    for (var i = data_cpu.length - 3; i < data_cpu.length; i++) {
        if (i >= 0) somaUltimos3Meses_cpu += data_cpu[i];
    }

    var dadosGrafico_cpu = [
        data_cpu[0] || 0,
        data_cpu[1] || 0,
        data_cpu[2] || 0,
        previsao_cpu ? Number(previsao_cpu) : 0
    ];

    document.querySelector("#graficoLinha").innerHTML = "";

    let seriesSelecionadas = [];
    let coresSelecionadas = [];

    if (componenteSelecionado === "ram") {
        seriesSelecionadas.push({
            name: 'RAM',
            data: dadosGrafico_ram
        });
        coresSelecionadas.push('#FF8CA5'); // rosa
    } else if (componenteSelecionado === "cpu") {
        seriesSelecionadas.push({
            name: 'CPU',
            data: dadosGrafico_cpu
        });
        coresSelecionadas.push('#69D7FF'); // azul
    } else if (componenteSelecionado === "todos") {
        seriesSelecionadas.push({
            name: 'RAM',
            data: dadosGrafico_ram
        });
        seriesSelecionadas.push({
            name: 'CPU',
            data: dadosGrafico_cpu
        });
        coresSelecionadas.push('#FF8CA5'); // RAM = rosa
        coresSelecionadas.push('#69D7FF'); // CPU = azul
    }

    var options = {
        series: seriesSelecionadas,
        chart: {
            height: 350,
            type: 'line',
        },
        colors: coresSelecionadas,
        forecastDataPoints: {
            count: 1
        },
        stroke: {
            width: 5,
            curve: 'smooth'
        },
        xaxis: {
            type: 'category',
            categories: categoriasGrafico
        },
        title: {
            text: 'Porcentagem (%)',
            align: 'left',
            style: {
                fontSize: "16px",
                color: '#666'
            }
        },
        fill: {
            gradient: {
                shade: 'dark',
                gradientToColors: ['#FDD835'],
                shadeIntensity: 1,
                type: 'horizontal',
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100, 100, 100]
            },
        }
    };

    var chart = new ApexCharts(document.querySelector("#graficoLinha"), options);
    chart.render();

    const ram = Number(previsao_ram);
    const cpu = Number(previsao_cpu);
    let total = 0;

    if (componenteSelecionado === "ram") {
        total = ram;
        document.getElementById("componente").innerText = "RAM";
        document.getElementById("percentual").innerText = "100%";
    } else if (componenteSelecionado === "cpu") {
        total = cpu;
        document.getElementById("componente").innerText = "CPU";
        document.getElementById("percentual").innerText = "100%";
    } else {
        total = ram + cpu;
        if (total > 0) {
            let maiorComponente = "";
            let percentual = 0;

            if (ram > cpu) {
                maiorComponente = "RAM";
                percentual = (ram / total) * 100;
            } else if (cpu > ram) {
                maiorComponente = "CPU";
                percentual = (cpu / total) * 100;
            } else {
                maiorComponente = "Empate";
                percentual = 50;
            }

            document.getElementById("componente").innerText = `${maiorComponente}`;
            document.getElementById("percentual").innerText = `${percentual.toFixed(1)}%`;
        } else {
            document.getElementById("percentual").innerText = `Sem dados`;
        }
    }

    var totalUltimos3Meses = somaUltimos3Meses_cpu + somaUltimos3Meses_ram;
    var totalPrevisto = dadosGrafico_cpu[3] + dadosGrafico_ram[3];

    var percentualQueda = ((totalUltimos3Meses - totalPrevisto) * 100) / totalUltimos3Meses;

    if (isNaN(percentualQueda)) {
        percentualQueda = 0;
    } else {
        percentualQueda = percentualQueda.toFixed(1);
    }

    var totalUltimos3Meses_ram = somaUltimos3Meses_ram;
    var previsao_ram_num = dadosGrafico_ram[3];

    var percentualQueda_ram = ((totalUltimos3Meses_ram - previsao_ram_num) * 100) / totalUltimos3Meses_ram;

    if (isNaN(percentualQueda_ram)) {
        percentualQueda_ram = 0;
    } else {
        percentualQueda_ram = percentualQueda_ram.toFixed(2);
    }

    var totalUltimos3Meses_cpu = somaUltimos3Meses_cpu;
    var previsao_cpu_num = dadosGrafico_cpu[3];

    var percentualQueda_cpu = ((totalUltimos3Meses_cpu - previsao_cpu_num) * 100) / totalUltimos3Meses_cpu;

    if (isNaN(percentualQueda_cpu)) {
        percentualQueda_cpu = 0;
    } else {
        percentualQueda_cpu = percentualQueda_cpu.toFixed(2);
    }

    if (componenteSelecionado === "ram") {
        document.getElementById("taxaPrecisao").innerText = `${r2_ram}%`;
        document.getElementById("kpi_total").innerText = dadosGrafico_ram[3];

        document.getElementById("queda_percentual").innerHTML = `Queda de ${percentualQueda_ram}%`;

        if (r2_ram <= 33.3) {
            document.querySelector(".taxa_kpi").style.backgroundColor = "#DE2828";
        } else if (r2_ram > 33.3 && r2_ram <= 66.6) {
            document.querySelector(".taxa_kpi").style.backgroundColor = "#DEC828";
        } else if (r2_ram > 66.6) {
            document.querySelector(".taxa_kpi").style.backgroundColor = "#00A100";
        }
    } else if (componenteSelecionado === "cpu") {
        document.getElementById("taxaPrecisao").innerText = `${r2_cpu}%`;
        document.getElementById("kpi_total").innerText = dadosGrafico_cpu[3];

        document.getElementById("queda_percentual").innerHTML = `Queda de ${percentualQueda_cpu}%`;

        if (r2_cpu <= 33.3) {
            document.querySelector(".taxa_kpi").style.backgroundColor = "#DE2828";
        } else if (r2_cpu > 33.3 && r2_cpu <= 66.6) {
            document.querySelector(".taxa_kpi").style.backgroundColor = "#DEC828";
        } else if (r2_cpu > 66.6) {
            document.querySelector(".taxa_kpi").style.backgroundColor = "#00A100";
        }
    } else {
        const media_r2 = ((parseFloat(r2_ram) + parseFloat(r2_cpu)) / 2).toFixed(1);
        document.getElementById("taxaPrecisao").innerText = `${media_r2}%`;
        document.getElementById("queda_percentual").innerHTML = `Queda de ${percentualQueda}%`;

        if (media_r2 <= 33.3) {
            document.querySelector(".taxa_kpi").style.backgroundColor = "#DE2828";
        } else if (media_r2 > 33.3 && media_r2 <= 66.6) {
            document.querySelector(".taxa_kpi").style.backgroundColor = "#DEC828";
        } else if (media_r2 > 66.6) {
            document.querySelector(".taxa_kpi").style.backgroundColor = "#00A100";
        }

        document.getElementById("kpi_total").innerText = dadosGrafico_ram[3] + dadosGrafico_cpu[3];
    }


    atualizarKPI();
    buscarEndereco();
}

document.addEventListener("DOMContentLoaded", function () {
    const selectComponente = document.getElementById("select_componente");
    selectComponente.addEventListener("change", atualizarGrafico);
    atualizarGrafico();
});

let chartBarra = null;

function atualizarBarras(valores) {
    console.log("Valores recebidos no atualizarBarras:", valores);

    if (!valores || !Array.isArray(valores) || valores.length === 0) {
        console.error("Erro: valores inválidos para o gráfico de barras.");
        return;
    }

    if (chartBarra) {
        chartBarra.destroy();
        chartBarra = null;
    }

    const graficoDiv = document.querySelector("#graficoBarras");
    graficoDiv.innerHTML = '';

    const options = {
        series: [{
            name: 'Média Simples',
            data: valores
        }],
        chart: {
            height: 320,
            type: 'bar',
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
                dataLabels: {
                    position: 'top',
                },
            }
        },
        dataLabels: {
            enabled: true,
            formatter: val => val.toFixed(1),
            offsetY: -20,
            style: {
                fontSize: '12px',
                colors: ["#304758"]
            }
        },
        xaxis: {
            categories: ["Temperatura Média", "Chuva (mm)", "Velocidade do Vento"],
            position: 'top',
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: {
                style: { fontSize: '14px', color: '#000' },
                theme: 'light'
            }
        },
        yaxis: {
            labels: {
                formatter: val => val.toFixed(1)
            }
        },
        title: {
            text: 'Média dos Indicadores Climáticos',
            floating: true,
            offsetY: 300,
            align: 'center',
            style: { color: '#444' }
        }
    };

    chartBarra = new ApexCharts(graficoDiv, options);
    chartBarra.render();
}

function atualizarKPI() {
    const componenteSelecionado = document.getElementById("select_componente").value;

    var baixo_ram = 0;
    var alto_ram = 0;
    var critico_ram = 0;
    var baixo_cpu = 0;
    var alto_cpu = 0;
    var critico_cpu = 0;

    fetch(`/dashLeticia/getAlertasNivel`, {
        cache: 'no-store',
        method: "GET",
    })
        .then((resposta) => resposta.json())
        .then((json) => {
            json.forEach(info => {
                const gravidade = info.gravidade.toLowerCase();
                const componente = info.componente.toLowerCase();
                const qtd = info.quantidade_alertas;

                if (componente === "ram") {
                    if (gravidade === "baixa") baixo_ram += qtd;
                    else if (gravidade === "alta") alto_ram += qtd;
                    else if (gravidade === "critico") critico_ram += qtd;
                } else if (componente === "processador") {
                    if (gravidade === "baixa") baixo_cpu += qtd;
                    else if (gravidade === "alta") alto_cpu += qtd;
                    else if (gravidade === "critico") critico_cpu += qtd;
                }
            });

            if (componenteSelecionado === "ram") {
                document.getElementById("nivel_baixo").innerText = `${baixo_ram}`;
                document.getElementById("nivel_alto").innerText = `${alto_ram}`;
                document.getElementById("nivel_critico").innerText = `${critico_ram}`;
            } else if (componenteSelecionado === "cpu") {
                document.getElementById("nivel_baixo").innerText = `${baixo_cpu}`;
                document.getElementById("nivel_alto").innerText = `${alto_cpu}`;
                document.getElementById("nivel_critico").innerText = `${critico_cpu}`;
            } else {
                document.getElementById("nivel_baixo").innerText = `${baixo_ram + baixo_cpu}`;
                document.getElementById("nivel_alto").innerText = `${alto_ram + alto_cpu}`;
                document.getElementById("nivel_critico").innerText = `${critico_ram + critico_cpu}`;
            }
        });
}

function multiplicar(x, y) {
    var resultado = [];
    for (var i = 0; i < x.length; i++) {
        resultado.push(x[i] * y[i]);
    }
    return resultado;
}

function quadrado(x) {
    var resultado = [];
    for (var i = 0; i < x.length; i++) {
        resultado.push(x[i] * x[i]);
    }
    return resultado;
}

function somar(x) {
    var total = 0;
    for (var i = 0; i < x.length; i++) {
        total += x[i];
    }
    return total;
}

function media(x) {
    return somar(x) / x.length;
}

function calcularR2(x, y) {
    var mediaX = media(x);
    var mediaY = media(y);

    var xSubMedia = [];
    var ySubMedia = [];
    for (var i = 0; i < x.length; i++) {
        xSubMedia.push(x[i] - mediaX);
        ySubMedia.push(y[i] - mediaY);
    }

    var numerador = 0;
    var somaQuadradoX = 0;
    var somaQuadradoY = 0;
    for (var i = 0; i < xSubMedia.length; i++) {
        numerador += xSubMedia[i] * ySubMedia[i];
        somaQuadradoX += xSubMedia[i] * xSubMedia[i];
        somaQuadradoY += ySubMedia[i] * ySubMedia[i];
    }

    var denominador = Math.sqrt(somaQuadradoX * somaQuadradoY);

    var r = numerador / denominador;

    return r * r;
}

function monthNameToNumber(monthName) {
    const months = {
        January: 1, February: 2, March: 3, April: 4, May: 5,
        June: 6, July: 7, August: 8, September: 9,
        October: 10, November: 11, December: 12
    };
    return months[monthName] || null;
}

function buscarEndereco() {
    fetch(`/dashLeticia/getEndereco`, {
        cache: 'no-store',
        method: "GET"
    }).then(res => res.json())
        .then(dados => {
            if (dados.length > 0) {
                const aeroporto = dados[0].aeroporto;
                const usuario_dash = dados[0].usuario;

                if (aeroporto == "Internacional de Guarulhos (GRU)") {
                    document.getElementById("aeroporto_endereco").textContent = `Aeroporto Internacional de Guarulhos`;
                }

                if (usuario_dash == "Estela") {
                    document.getElementById("boas_vindas").textContent = `Boas-vindas, ${usuario_dash}!`;
                }
            }
        })
        .catch(err => console.error("Erro ao buscar endereço:", err));
}

function getCsvAndConvertToJson() {
    fetch(`/dashLeticia/getCsvAndConvertToJson`, {
        cache: 'no-store',
        method: "GET",
    })
        .then(res => res.json())
        .then(json => {
            console.log("Dados recebidos do CSV:", json);

            const total = json.length;
            let somaTempMedia = 0;
            let somaChuva = 0;
            let somaVento = 0;

            json.forEach(linha => {
                somaTempMedia += parseFloat(linha["tavg"] || 0);
                somaChuva += parseFloat(linha["prcp"] || 0);
                somaVento += parseFloat(linha["wspd"] || 0);
            });

            const medias = [
                (somaTempMedia / total).toFixed(2),
                (somaChuva / total).toFixed(2),
                (somaVento / total).toFixed(2),
            ].map(Number);

            console.log("Médias calculadas para gráfico:", medias);

            atualizarBarras(medias);
        })
        .catch(err => {
            console.error("Erro ao buscar CSV convertido:", err);
        });
}