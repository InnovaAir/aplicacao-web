sessionStorage.idFilial = null;

let totensAlerta = 0;
let totensOciosos = 0;
let totensNormal = 0;
let idMaquina = 0;
let filiais = [];
let dados_json = [];
let filtroTerminalSelecionado = null;
let filtroDesempenhoSelecionado = null;
let campoSelecionado = null;
let ordemCrescente = true;


const filtros = document.querySelectorAll('.filtro');
filtros.forEach(filtro => {
  filtro.addEventListener('click', () => {
    const selecionado = filtro.classList.contains('selecionado');

    filtros.forEach(f => f.classList.remove('selecionado'));

    if (!selecionado) {
      filtro.classList.add('selecionado');
      filtroDesempenhoSelecionado = filtro.dataset.filtro;
    } else {
      filtroDesempenhoSelecionado = null;
    }
    aplicarFiltrosCombinados();
  });
});

function aplicarFiltro() {
  const select = document.getElementById("slc_filial");
  filtroTerminalSelecionado = select.value === "" ? null : select.value;
  aplicarFiltrosCombinados();
}

function aplicarFiltrosCombinados() {
  let dadosFiltrados = dados_json;

  if (filtroDesempenhoSelecionado === "verde") {
    dadosFiltrados = dadosFiltrados.filter(maq => maq.desempenho >= 75);
  } 
  else if (filtroDesempenhoSelecionado === "amarelo") {
    dadosFiltrados = dadosFiltrados.filter(maq => maq.desempenho >= 50 && maq.desempenho < 75);
  } 
  else if (filtroDesempenhoSelecionado === "vermelho") {
    dadosFiltrados = dadosFiltrados.filter(maq => maq.desempenho >= 25 && maq.desempenho < 50);
  }
  else if (filtroDesempenhoSelecionado === "roxo") {
    dadosFiltrados = dadosFiltrados.filter(maq => maq.desempenho < 25);
  }

  if (filtroTerminalSelecionado && filiais.includes(filtroTerminalSelecionado)) {
    dadosFiltrados = dadosFiltrados.filter(maq => maq.terminal === filtroTerminalSelecionado);
  }

  if (campoSelecionado) {
    ordenarPor(campoSelecionado, false, dadosFiltrados);
  } 
  else {
    carregarMaquinas(dadosFiltrados)
  }
}

function carregarMaquinas(dados) {
  let qtdMaquinas = dados.length;
  let qtdMaqMenorDsmp = dados.filter(dado => dado.desempenho < 35).length;
  let totalAlertas = dados.reduce((acc, curr) => acc + (parseInt(curr.critico) || 0), 0);

  const lista = document.getElementById('lista_maquinas');
  lista.innerHTML = '';

  dados.forEach(maq => {
    const desempenho = maq.desempenho != null ? maq.desempenho.toFixed(0) : 'N/A';

    let classe = 'green';
    if (desempenho !== 'N/A') {
      const valor = parseInt(desempenho);
      if (valor < 25) classe = 'purple';
      else if (valor < 50) classe = 'red';
      else if (valor < 75) classe = 'yellow'
    }

    const div = document.createElement('div');
    div.className = `totem ${classe}`;
    div.innerHTML = `
      <div class="coluna">${maq.totem || '-'}</div>
      <div class="coluna">${maq.terminal || '-'}</div>
      <div class="coluna">${maq.critico || 0}</div>
      <div class="coluna">${maq.alto || 0}</div>
      <div class="coluna">${maq.baixo || 0}</div>
      <div class="coluna">${maq.total_alertas || 0}</div>
      <div class="coluna">${maq.desempenho !== undefined ? maq.desempenho + '%' : 'N/A'}</div>
    `;
    lista.appendChild(div);
  });

  document.getElementById('kpi_total').innerText = qtdMaquinas;
  document.getElementById('kpi_baixo').innerText = qtdMaqMenorDsmp;
  document.getElementById('kpi_alertas').innerText = totalAlertas;
}

function atualizarKPIsTotais() {
  let qtdMaquinas = dados_json.length;
  let qtdMaqMenorDsmp = dados_json.filter(dado => dado.desempenho < 35).length;
  let totalAlertas = dados_json.reduce((acc, curr) => acc + (parseInt(curr.critico) || 0), 0);

  document.getElementById('kpi_total').innerText = qtdMaquinas;
  document.getElementById('kpi_baixo').innerText = qtdMaqMenorDsmp;
  document.getElementById('kpi_alertas').innerText = totalAlertas;
}

async function dashDudu() {
  try {
    const res = await fetch(`/dashDuduRoutes/dash-dudu/${sessionStorage.idUsuario}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    console.log(data)

    data.sort((a, b) => {
      if (a.desempenho == null || isNaN(a.desempenho)) return 1;
      if (b.desempenho == null || isNaN(b.desempenho)) return -1;
      return a.desempenho - b.desempenho;
    });

    dados_json = data;
    aplicarFiltrosCombinados();
    atualizarGraficoDesempenho(dados_json);
    atualizarKPIsTotais();
  } catch (err) {
    console.error('Erro ao carregar os dados:', err);
  }
}

async function listarFiliais() {
  try {
    const res = await fetch(`/cadastros/metricas/listar/filiais/${sessionStorage.idUsuario}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const json_filiais = await res.json();

    const slc_filial = document.getElementById("slc_filial");
    slc_filial.innerHTML = `<option disabled value="null">Selecione um aeroporto</option>`;
    slc_filial.innerHTML += `<option selected value="">Todos os meus aeroportos</option>`;

    filiais = [];
    for (const filialAtual of json_filiais) {
      slc_filial.innerHTML += `<option value="${filialAtual.terminal}">${filialAtual.terminal}</option>`;
      filiais.push(filialAtual.terminal);
    }
  } catch (error) {
    console.error("Erro ao realizar o Fetch das filiais", error);
  }
}

async function getIdUsuario(){
  try {
    const res = await fetch(`/dashDuduRoutes/getIdUsuario/${sessionStorage.idUsuario}`);
    const data = await res.json();
    console.log('Entrei no fetch e tenho esses dados:', data);
  } catch(err) {
    console.error('Erro ao carregar os dados:', err);
  }
}

const ordemInicialPorCampo = {
  totem: true,
  setor: true,
  critico: false,
  alto: false,
  baixo: false,
  total: false,
  desempenho: true
};

function ordenarPor(campo, inverter = true, dadosParaOrdenar = null) {
  if (inverter) {
    if (campoSelecionado === campo) {
      ordemCrescente = !ordemCrescente;
    } 
    else {
      campoSelecionado = campo;
      ordemCrescente = true;
    }
  } 
  else {
    campoSelecionado = campo;
  }

  let dados = dadosParaOrdenar ? [...dadosParaOrdenar] : [...dados_json];

  dados.sort((a, b) => {
    let valorA = a[campo];
    let valorB = b[campo];

    if (valorA == null) valorA = '';
    if (valorB == null) valorB = '';

    const ehNumero = !isNaN(valorA) && !isNaN(valorB);

    if (ehNumero) {
      valorA = Number(valorA);
      valorB = Number(valorB);
    } 
    else {
      if (campo === 'totem') {
        const re = /^(\D*)(\d+)$/;
        const matchA = valorA.match(re);
        const matchB = valorB.match(re);
        if (matchA && matchB && matchA[1] === matchB[1]) {
          valorA = parseInt(matchA[2]);
          valorB = parseInt(matchB[2]);
        } 
        else {
          valorA = valorA.toLowerCase();
          valorB = valorB.toLowerCase();
        }
      } 
      else {
        valorA = valorA.toString().toLowerCase();
        valorB = valorB.toString().toLowerCase();
      }
    }

    if (ordemCrescente) {
      return valorA > valorB ? 1 : valorA < valorB ? -1 : 0;
    } 
    else {
      return valorA < valorB ? 1 : valorA > valorB ? -1 : 0;
    }
  });

  carregarMaquinas(dados);
}

function ordenarColuna(campo) {
  campoSelecionado = campo;
  ordemCrescente = campoSelecionado === campo ? !ordemCrescente : true;

  let dadosFiltrados = dados_json;

  if (filtroDesempenhoSelecionado === "verde") {
    dadosFiltrados = dadosFiltrados.filter(maq => maq.desempenho >= 70);
  } 
  else if (filtroDesempenhoSelecionado === "amarelo") {
    dadosFiltrados = dadosFiltrados.filter(maq => maq.desempenho >= 30 && maq.desempenho < 70);
  } 
  else if (filtroDesempenhoSelecionado === "vermelho") {
    dadosFiltrados = dadosFiltrados.filter(maq => maq.desempenho < 35);
  }

  if (filtroTerminalSelecionado && filiais.includes(filtroTerminalSelecionado)) {
    dadosFiltrados = dadosFiltrados.filter(maq => maq.terminal === filtroTerminalSelecionado);
  }

  atualizarSetas();
  ordenarPor(campo, false, dadosFiltrados);
}

function atualizarSetas() {
    const colunas = document.querySelectorAll('.tabela_cabecalho .coluna');
    colunas.forEach(div => {
      div.classList.remove('ativa');
      const span = div.querySelector('span.seta');
      if (span) span.textContent = '⇅';
    });

    if (!campoSelecionado) return;

    const colunaAtiva = [...colunas].find(div => {
      return div.getAttribute('onclick').includes(`'${campoSelecionado}'`);
    });

    if (!colunaAtiva) return;

    colunaAtiva.classList.add('ativa');

    const setaSpan = colunaAtiva.querySelector('span.seta');
    if (setaSpan) {
      setaSpan.textContent = ordemCrescente ? '▲' : '▼';
    }
}

//Dashboard
function atualizarGraficoDesempenho(maquinas) {
  const terminais = {};

  maquinas.forEach(maq => {
    const terminal = maq.terminal;
    const desempenho = parseFloat(maq.desempenho ?? 0);
    const critico = parseInt(maq.critico) || 0;
    const alto = parseInt(maq.alto) || 0;
    const baixo = parseInt(maq.baixo) || 0;
    const peso = (critico * 5) + (alto * 2) + (baixo * 1);

    if (!terminais[terminal]) {
      terminais[terminal] = {
        somaPonderada: 0,
        somaPesos: 0,
        somatorioDesempenho: 0,
        total: 0
      };
    }

    if (peso > 0) {
      terminais[terminal].somaPonderada += desempenho * peso;
      terminais[terminal].somaPesos += peso;
    } else {
      terminais[terminal].somatorioDesempenho += desempenho;
      terminais[terminal].total += 1;
    }
  });

  const desempenhoPorTerminal = [];

  for (const terminal in terminais) {
    const { somaPonderada, somaPesos, somatorioDesempenho, total } = terminais[terminal];

    let desempenhoFinal = 0;

    if (somaPesos > 0) {
      desempenhoFinal = somaPonderada / somaPesos;
    } else if (total > 0) {
      desempenhoFinal = somatorioDesempenho / total;
    }

    desempenhoPorTerminal.push({
      terminal,
      desempenho: parseFloat(desempenhoFinal.toFixed(1))
    });
  }

  desempenhoPorTerminal.sort((a, b) => a.desempenho - b.desempenho);

  grafico.data.labels = desempenhoPorTerminal.map(d => d.terminal);
  grafico.data.datasets[0].data = desempenhoPorTerminal.map(d => d.desempenho);

  grafico.data.datasets[0].backgroundColor = desempenhoPorTerminal.map(d => {
    if (d.desempenho <= 35) return '#8537C8';
    if (d.desempenho <= 65) return '#DEC828';
    return '#00A100';
  });

  grafico.update();
}

Chart.register(ChartDataLabels);

const ctx = document.getElementById('graficoDesempenho').getContext('2d');

const grafico = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      barThickness: 50,
      minBarLength: 2,
      barPercentage: 0.5,
      categoryPercentage: 0.2,
      label: 'Desempenho',
      data: [],
      backgroundColor: [],
      borderWidth: 1
    }]
  },
  options: {
    layout:{
      padding: {
        right: 50
      }
    },
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
          font: { weight: 'bold' }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Filiais',
          color: '#0000A5',
          font: { weight: 'bold' }
        }
      }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.x;
            return `${label}: ${value}%`;
          }
        }
      },
      datalabels: {
        anchor: 'end',
        align: 'right',
        formatter: function(value) {
          return value + '%';
        },
        color: '#000',
        font: {
          weight: 'bold',
          size: 15
        }
      }
    }
  },
  plugins: [ChartDataLabels]
});

window.onload = async function () {
  await getIdUsuario();
  await listarFiliais();
  await dashDudu();
};