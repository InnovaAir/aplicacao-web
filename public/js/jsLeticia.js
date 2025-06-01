async function atualizarGrafico() {
    var data = [];
    var categoria = [];
    var categoriaNum = [];

    const meses = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    await fetch(`/dashLeticia/getAlertas/`, {
        cache: 'no-store',
        method: "GET",
    }).then((resposta) => resposta.json())
      .then((json) => {
        json.forEach(info => {
            categoria.push(info.mes);
            categoriaNum.push(monthNameToNumber(info.mes));
            data.push(info.total_alertas);
        });
    });

    const mes = categoria[categoria.length - 1];
    const indexAtual = meses.indexOf(mes);
    const mesPrevisto = meses[(indexAtual + 1) % 12];

    // Cálculo correto de m (coeficiente angular)
    var sumXY = somar(multiplicar(categoriaNum, data));
    var sumX = somar(categoriaNum);
    var sumY = somar(data);
    var n = categoriaNum.length;
    var sumX2 = somar(quadrado(categoriaNum));

    var m = (sumXY - (sumX * sumY) / n) / (sumX2 - (sumX * sumX) / n);
    var b = media(data) - m * media(categoriaNum);

    var r2 = (calcularR2(categoriaNum, data) * 100).toFixed();

    document.getElementById("taxaPrecisao").innerText = `${r2}%`;

    var valorPrevisto = categoriaNum[categoriaNum.length - 1] + 1;
    var previsao = (m * valorPrevisto + b).toFixed();

    if (isNaN(previsao)) {
        console.log("Dados insuficientes para previsão");
        previsao = null;
    }

    var categoriasGrafico = [
        categoria[0] || "",
        categoria[1] || "",
        categoria[2] || "",
        mesPrevisto
    ];

    var dadosGrafico = [
        data[0] || 0,
        data[1] || 0,
        data[2] || 0,
        previsao ? Number(previsao) : 0
    ];

    var options = {
        series: [{
            name: 'Alertas',
            data: dadosGrafico
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
            categories: categoriasGrafico
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

    console.log("Último mês:", mes);
    console.log("Próximo mês previsto:", mesPrevisto);
    console.log("Previsão de alertas para o próximo mês:", previsao);
    console.log("R² (precisão):", r2 + "%");
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
