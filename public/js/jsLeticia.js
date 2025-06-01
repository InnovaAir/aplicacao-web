async function atualizarGrafico() {
    var data = []
    var categoria = []
    var categoriaNum = []

    fetch(`/dashLeticia/getAlertas/`, {
        cache: 'no-store',
        method: "GET",
    }).then((answer) => {
        answer.json().then((json) => {
            json.map(info => {
                categoria.push(info.mes)
                categoriaNum.push(monthNameToNumber(info.mes))
                data.push(info.total_alertas)
            })
        })
    })

    var x = categoriaNum;
    var y = data; 
    const meses = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const mes = categoria[categoria.length - 1]; // pega o último mês da lista
    const indexAtual = meses.indexOf(mes);
    const mesPrevisto = meses[indexAtual + 1] || null; // pega o próximo mês ou null se for Dezembro
    console.log(categoria);         // May
    console.log("Último mês:", mes);         // May
    console.log("Próximo mês:", mesPrevisto); // June

    // var valorPrevisto = meses.indexOf(mes) + 2; // A soma do valor 2 é necessária pois o index do mes no caso de dezembro é 11, porém quero prever o mês 13

    var m = (somar(multiplicar(x, y)) - (somar(x) * somar(y)) / x.length) /
        (somar(quadrado(x)) - (somar(x) * somar(x)) / x.length);
    var b = media(y) - m * media(x);

    var r2 = (calcularR2(x, y) * 100).toFixed()

    var total = somar(data)
    console.log(data)

    if (r2 != "NaN") {

        if (meses.indexOf(mes) + 1 >= 12) {
            mesPrevisto = meses[(meses.indexOf(mes) - 11)]
            valorPrevisto = 13
        }

        // document.getElementById("mesPrevisto").innerHTML = `${mesPrevisto}`
        // document.getElementById("previsao").innerHTML = `${(m * (valorPrevisto) + b).toFixed()}<span id="rquadrado"></span>`
        // document.getElementById("rquadrado").innerHTML = ` / Precisão: ${r2}%`

    } else {
        // document.getElementById("previsao").innerHTML = `<span id="rquadrado">Dados insuficientes</span>`
    }


    var options = {
        series: [{
            name: 'RAM',
            data: [4, 3, 10, 9]
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
            categories: [
                categoria[0], categoria[1], categoria[2], categoria[3]
            ]
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
}


// Fórmulas
function multiplicar(x, y) {
    var ret = [];
    for (var i = 0; i < x.length; i++)
        ret.push(x[i] * y[i]);
    return ret;
}

function quadrado(x) {
    var ret = [];
    for (var i = 0; i < x.length; i++)
        ret.push(x[i] * x[i]);
    return ret;
}

function somar(x) {
    var ret = 0;
    for (var i = 0; i < x.length; i++)
        ret += x[i];
    return ret;
}

function media(x) {
    return somar(x) / x.length;
}

function calcularR2(x, y) {
    const n = x.length;
    const mediaX = media(x);
    const mediaY = media(y);

    let numerador = somar(multiplicar(
        x.map(xi => xi - mediaX),
        y.map(yi => yi - mediaY)
    ));

    let somaQuadradoX = somar(quadrado(x.map(xi => xi - mediaX)));
    let somaQuadradoY = somar(quadrado(y.map(yi => yi - mediaY)));
    const denominador = Math.sqrt(somaQuadradoX * somaQuadradoY);

    const r = numerador / denominador;

    const r2 = Math.pow(r, 2)
    sessionStorage.r2 = r2;
    return r2;
}

function monthNameToNumber(monthName) {
    const months = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12
    };

    return months[monthName] || null;
}
