sessionStorage.idFilial = null;

let totensAlerta = 0;
let totensOciosos = 0;
let totensNormal = 0;
let idMaquina = 0;
let filiais = [];
let dados_json = [];
let filtroTerminalSelecionado = null;
let filtroDesempenhoSelecionado = null;

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

  // Filtra por desempenho
  if (filtroDesempenhoSelecionado === "verde") {
    dadosFiltrados = dadosFiltrados.filter(maq => maq.desempenho >= 70);
  } else if (filtroDesempenhoSelecionado === "amarelo") {
    dadosFiltrados = dadosFiltrados.filter(maq => maq.desempenho >= 30 && maq.desempenho < 70);
  } else if (filtroDesempenhoSelecionado === "vermelho") {
    dadosFiltrados = dadosFiltrados.filter(maq => maq.desempenho < 30);
  }

  // Filtra por terminal
  if (filtroTerminalSelecionado && filiais.includes(filtroTerminalSelecionado)) {
    dadosFiltrados = dadosFiltrados.filter(maq => maq.terminal === filtroTerminalSelecionado);
  }

  carregarMaquinas(dadosFiltrados);
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
      if (valor < 30) classe = 'red';
      else if (valor < 70) classe = 'yellow';
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

// Dashboard
const ctx = document.getElementById('graficoDesempenho').getContext('2d');

function atualizarGraficoDesempenho(maquinas) {
  const terminais = {};

  maquinas.forEach(maq => {
    const terminal = maq.terminal;
    const desempenho = parseFloat(maq.desempenho ?? 0);
    const peso = (maq.critico * 2) + (maq.alto * 1);

    if (!terminais[terminal]) {
      terminais[terminal] = { somaPonderada: 0, somaPesos: 0 };
    }

    terminais[terminal].somaPonderada += desempenho * peso;
    terminais[terminal].somaPesos += peso;
  });

  const desempenhoPorTerminal = [];

  for (const terminal in terminais) {
    const { somaPonderada, somaPesos } = terminais[terminal];
    const desempenhoFinal = somaPesos > 0 ? (somaPonderada / somaPesos) : 0;

    desempenhoPorTerminal.push({
      terminal,
      desempenho: parseFloat(desempenhoFinal.toFixed(1))
    });
  }

  desempenhoPorTerminal.sort((a, b) => a.desempenho - b.desempenho);

  grafico.data.labels = desempenhoPorTerminal.map(d => d.terminal);
  grafico.data.datasets[0].data = desempenhoPorTerminal.map(d => d.desempenho);
  grafico.data.datasets[0].backgroundColor = desempenhoPorTerminal.map(d => {
    if (d.desempenho <= 35) return '#ff3333';
    if (d.desempenho <= 65) return '#ffff33';
    return '#00cc00';
  });

  grafico.update();
}

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
      legend: { display: false }
    }
  }
});

async function executar() {
  await getIdUsuario();
  await listarFiliais();
  await dashDudu();
}

executar();
