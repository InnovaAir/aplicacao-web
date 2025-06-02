async function atualizarGrafico() {
    var data_ram = [];
    var data_cpu = [];
    var categoria = [];
    var categoriaNum = [];

    const meses = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

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

    // Calcula coeficiente angular (m) e linear (b) para regressão linear
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

    if (isNaN(previsao_ram)) {
        console.log("Dados insuficientes para previsão");
        previsao_ram = null;
    }

    // Somar alertas últimos 3 meses
    var somaUltimos3Meses_ram = 0;
    for (var i = data_ram.length - 3; i < data_ram.length; i++) {
        if (i >= 0) {
            somaUltimos3Meses_ram += data_ram[i];
        }
    }
    console.log("Soma alertas últimos 3 meses:", somaUltimos3Meses_ram);

    var categoriasGrafico_ram = [
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
    var n = categoriaNum.length;
    var sumX2_cpu = somar(quadrado(categoriaNum));

    var m_cpu = (sumXY_cpu - (sumX_cpu * sumY_cpu) / n) / (sumX2_cpu - (sumX_cpu * sumX_cpu) / n);
    var b_cpu = media(data_cpu) - m_cpu * media(categoriaNum);

    var r2_cpu = (calcularR2(categoriaNum, data_cpu) * 100).toFixed(1);

    var valorPrevisto = categoriaNum[categoriaNum.length - 1] + 1;
    var previsao_cpu = (m_cpu * valorPrevisto + b_cpu).toFixed();

    if (isNaN(previsao_cpu)) {
        console.log("Dados insuficientes para previsão");
        previsao_cpu = null;
    }

    // Somar alertas últimos 3 meses
    var somaUltimos3Meses_cpu = 0;
    for (var i = data_cpu.length - 3; i < data_cpu.length; i++) {
        if (i >= 0) {
            somaUltimos3Meses_cpu += data_cpu[i];
        }
    }
    console.log("Soma alertas últimos 3 meses:", somaUltimos3Meses_cpu);

    var categoriasGrafico_cpu = [
        categoria[0] || "",
        categoria[1] || "",
        categoria[2] || "",
        mesPrevisto
    ];

    var dadosGrafico_cpu = [
        data_cpu[0] || 0,
        data_cpu[1] || 0,
        data_cpu[2] || 0,
        previsao_cpu ? Number(previsao_cpu) : 0
    ];

    var options = {
        series: [
            {
                name: 'RAM',
                data: dadosGrafico_ram
            },
            {
                name: 'CPU',
                data: dadosGrafico_cpu
            }],
        chart: {
            height: 350,
            type: 'line',
        },
        forecastDataPoints: {
            count: 1
        },
        stroke: {
            width: 5,
            curve: 'smooth'
        },
        xaxis: {
            type: 'category',
            categories: categoriasGrafico_ram
        },
        title: {
            text: 'Forecast',
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

    if (!isNaN(ram) && !isNaN(cpu)) {
        const total = ram + cpu;

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
            document.getElementById("ram_percent").innerText = `Sem dados`;
        }

    } else {
        document.getElementById("ram_percent").innerText = `Sem dados suficientes`;
    }


    console.log("Último mês:", mes);
    console.log("Próximo mês previsto:", mesPrevisto);
    console.log("Previsão de alertas para o próximo mês:", previsao_ram);
    console.log("R² (precisão):", r2_ram + "%");

    document.getElementById("taxaPrecisao").innerText = `${r2_ram}%`;
    document.getElementById("kpi_total").innerText = somaUltimos3Meses_ram + somaUltimos3Meses_cpu;

    atualizarKPI();
}

function atualizarKPI() {
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
        console.log("Dados recebidos:", json);

        json.forEach(info => {
            console.log(info.gravidade, info.componente, info.quantidade_alertas);

            if (info.gravidade.toLowerCase() == "baixa" && info.componente.toLowerCase() == "ram") {
                baixo_ram += info.quantidade_alertas;
            }

            if (info.gravidade.toLowerCase() == "alta" && info.componente.toLowerCase() == "ram") {
                alto_ram += info.quantidade_alertas;
            }

            if (info.gravidade.toLowerCase() == "critico" && info.componente.toLowerCase() == "ram") {
                critico_ram += info.quantidade_alertas;
            }

            if (info.gravidade.toLowerCase() == "baixa" && info.componente.toLowerCase() == "processador") {
                baixo_cpu += info.quantidade_alertas;
            }

            if (info.gravidade.toLowerCase() == "alta" && info.componente.toLowerCase() == "processador") {
                alto_cpu += info.quantidade_alertas;
            }

            if (info.gravidade.toLowerCase() == "critico" && info.componente.toLowerCase() == "processador") {
                critico_cpu += info.quantidade_alertas;
            }
        });

        document.getElementById("nivel_baixo").innerText = `${baixo_ram + baixo_cpu}`;
        document.getElementById("nivel_alto").innerText = `${alto_ram + alto_cpu}`;
        document.getElementById("nivel_critico").innerText = `${critico_ram + critico_cpu}`;
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
