totensAlerta = 0;
totensOciosos = 0;
totensNormal = 0;


// FILTROS DOS 3 BOTÕES COLORIDOS ACIMA DA LISTA

const filtros = document.querySelectorAll('.filtro');

filtros.forEach(filtro => {
  filtro.addEventListener('click', () => {
    const selecionado = filtro.classList.contains('selecionado');

    filtros.forEach(f => f.classList.remove('selecionado'));

    if (!selecionado) {
      filtro.classList.add('selecionado');
      const tipoSelecionado = filtro.dataset.filtro;
      filtrarPorDesempenho(tipoSelecionado);
    } else {
      
      filtrarPorDesempenho(null);
    }
  });
});



// FILTRO DE ORDENAÇÃO DO HEADER DA LISTA

let ordemCres = true;

function ordenar(item) {
  ordemCres = !ordemCres;

  listaMaquinas.sort((a, b) => {
    if (ordemCres) {
      return a[item] > b[item] ? 1 : -1;
    } else {
      return a[item] < b[item] ? 1 : -1;
    }
  });

  renderizarMaquinas();
}

function renderizarMaquinas(){

    fetch("/dashDuduRoutes/dash-dudu", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then((answer) => {
      console.log("Passou aqui")
        answer.json().then(async (json) => {
            var tabela_conteudo = document.getElementById("lines");

            listTotensHTML = ``

            for (let i = 0; i < json.length; i++) {
                const totemAtual = json[i];

                const totalAlertasHoje = await getAlertas(totemAtual.id_maquina);

                var cpu = totemAtual.dados.cpu[totemAtual.dados.cpu.length - 1];
                var ram = totemAtual.dados.ram[totemAtual.dados.ram.length - 1];
                var disco = totemAtual.dados.disco[totemAtual.dados.disco.length - 1];
                var rede = Math.round((totemAtual.dados.rede[totemAtual.dados.rede.length - 1]) / 1024 / 1024, 1);
            
                var isOnAlert = false;
                var isIdle = false;
                var cpu_col, ram_col, disco_col, rede_col;

                if (cpu <= 10) {
                    isIdle = true; cpu_col = 'ball-green';
                }
                else if (cpu > 70 && cpu < 80) { cpu_col = "ball-yellow" }
                else if (cpu >= 80 && cpu < 90) { cpu_col = "ball-orange"; alertasCPU++; isOnAlert = true; }
                else if (cpu >= 90) { cpu_col = "ball-red"; alertasCPU++; isOnAlert = true; }
                else { cpu_col = 'ball-green'; }

                if (ram > 70 && ram < 80) { ram_col = "ball-yellow" }
                else if (ram >= 80 && ram < 90) { ram_col = "ball-orange"; alertasRAM++; isOnAlert = true; }
                else if (ram >= 90) { ram_col = "ball-red"; alertasRAM++; isOnAlert = true; }
                else { ram_col = 'ball-green'; }

                if (disco > 70 && disco < 80) { disco_col = "ball-yellow" }
                else if (disco >= 80 && disco < 90) { disco_col = "ball-orange"; alertasDISCO++; isOnAlert = true; }
                else if (disco >= 90) { disco_col = "ball-red"; alertasDISCO++; isOnAlert = true; }
                else { disco_col = 'ball-green'; }

                if (rede > 15 && rede < 20) { rede_col = "ball-yellow" }
                else if (rede >= 5 && rede < 10) { rede_col = "ball-orange"; alertasREDE++; isOnAlert = true; }
                else if (rede < 5) { rede_col = "ball-red"; alertasREDE++; isOnAlert = true; }
                else { rede_col = 'ball-green'; }

                if (isIdle && !isOnAlert) { isIdle = 'blue'; totensOciosos++ }
                else if (isIdle && isOnAlert) { isOnAlert = 'red'; isIdle = ''; totensAlerta++ }
                else if (isOnAlert && isIdle == false) { isOnAlert = 'red'; totensAlerta++; }
                else { isOnAlert = '', isIdle = '' }

                console.log(totalAlertasHoje)

                listToensHTML += `
                    <div id="${totemAtual.placa_mae}" class="totem ${isIdle} ${isOnAlert}">
                        <p>${totemAtual.placa_mae}</p>
                        <div class="box">
                            <div class="${cpu_col} ball"></div>
                            <span>${cpu}%</span>
                        </div>
                        <div class="box">
                            <div class="${ram_col} ball"></div>
                            <span>${ram}%</span>
                        </div>
                        <div class="box">
                            <div class="${disco_col} ball"></div>
                            <span>${disco}%</span>
                        </div>
                        <div class="box">
                            <div class="${rede_col} ball"></div>
                            <span>${rede}Mb</span>
                        </div>
                        <p>${totalAlertasHoje}</p>
                        <button>Analisar</button>
                        <button>Abrir</button>
                    </div>
                `
            }
            totensNormal = json.length - (totensOciosos + totensAlerta)
            getKPIs()

            tabela_conteudo.innerHTML = listToensHTML;

            var options = {
                series: [alertasCPU, alertasDISCO, alertasRAM, alertasREDE],
                chart: {
                    type: 'pie',
                    height: '100%', // O gráfico ocupa toda a altura da div
                },
                labels: ['CPU', 'DISCO', 'RAM', 'REDE'],
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            height: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            };

            alertasCPU = 0;
            alertasRAM = 0;
            alertasDISCO = 0;
            alertasREDE = 0;

            var chart = new ApexCharts(document.querySelector("#alert-chart"), options);
            chart.render();

        });
    });

}


// DASHBOARD

const ctx = document.getElementById('graficoDesempenho').getContext('2d');

const dados = [
  { filial: 'Filial 1', desempenho: 90 },
  { filial: 'Filial 4', desempenho: 55 },
  { filial: 'Filial 2', desempenho: 30 },
  { filial: 'Filial 3', desempenho: 20 }
]; // dados estaticos só p plotar algo 




// ordenação do pior pro melhor
const dadosOrdenados = [...dados].sort((a, b) => a.desempenho - b.desempenho);

// gerar labels
const labels = dadosOrdenados.map(item => item.filial);
const data = dadosOrdenados.map(item => item.desempenho);
const backgroundColor = dadosOrdenados.map(item => {
  if (item.desempenho <= 35) return '#ff3333';   
  if (item.desempenho <= 65) return '#ffff33';
  return '#00cc00';
});

// grafico
const grafico = new Chart(ctx, {
  type: 'bar',
  data: {
    labels,
    datasets: [{
      label: 'Desempenho',
      data,
      backgroundColor,
      borderWidth: 1
    }]
  },
  options: {
    indexAxis: 'y',
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (val) => `${val}%`
        },
        title: {
          display: true,
          text: 'Desempenho',
          color: '#0000A5',
          font: {
            weight: 'bold'
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Filiais',
          color: '#0000A5',
          font: {
            weight: 'bold'
          }
        }
      }
    },
    plugins: {
      legend: { display: false }
    }
  }
});