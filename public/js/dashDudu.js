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
let apexChart = null;

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
    dadosFiltrados = dadosFiltrados.filter(maq => maq.desempenho >= 65);
  } 
  else if (filtroDesempenhoSelecionado === "amarelo") {
    dadosFiltrados = dadosFiltrados.filter(maq => maq.desempenho >= 35 && maq.desempenho < 65);
  } 
  else if (filtroDesempenhoSelecionado === "vermelho") {
    dadosFiltrados = dadosFiltrados.filter(maq => maq.desempenho >= 10 && maq.desempenho < 35);
  }
  else if (filtroDesempenhoSelecionado === "roxo") {
    dadosFiltrados = dadosFiltrados.filter(maq => maq.desempenho < 10);
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
  let qtdMaqMenorDsmp = dados_json.filter(dado => dado.desempenho < 35).length;
  let qtdMaqCrit = dados_json.filter(dado => dado.desempenho < 10).length;

  const lista = document.getElementById('lista_maquinas');
  lista.innerHTML = '';

  dados.forEach(maq => {
    const desempenho = maq.desempenho != null ? maq.desempenho.toFixed(0) : 'N/A';

    let classe = 'green';
    if (desempenho !== 'N/A') {
      const valor = parseInt(desempenho);
      if (valor < 10) classe = 'purple';
      else if (valor < 35) classe = 'red';
      else if (valor < 65) classe = 'yellow';
    }

    let nomeTerminal;
    switch (maq.terminal) {
      case "1":
        nomeTerminal = "GRU";
        break;
      case "2":
        nomeTerminal = "SDU";
        break;
      default:
        nomeTerminal = maq.terminal || '-';
    }

    const div = document.createElement('div');
    div.className = `totem ${classe}`;
    div.innerHTML = `
      <div class="coluna">${maq.totem || '-'}</div>
      <div class="coluna">${nomeTerminal}</div>
      <div class="coluna">${maq.critico || 0}</div>
      <div class="coluna">${maq.alto || 0}</div>
      <div class="coluna">${maq.baixo || 0}</div>
      <div class="coluna">${maq.total_alertas || 0}</div>
      <div class="coluna">${maq.desempenho.toFixed(2) !== undefined ? maq.desempenho.toFixed(2) + '%' : 'N/A'}</div>
    `;

    if (classe === 'yellow') {
      const colunasDestaLinha = div.getElementsByClassName('coluna');
      for (let i = 0; i < colunasDestaLinha.length; i++) {
        colunasDestaLinha[i].style.color = 'black';
      }
    }

    lista.appendChild(div);
  });

  document.getElementById('kpi_total').innerText = qtdMaquinas;
  document.getElementById('kpi_baixo').innerText = qtdMaqMenorDsmp;
  document.getElementById('kpi_alertas').innerText = qtdMaqCrit;
}


function atualizarKPIsTotais() {
  let qtdMaquinas = dados_json.length;
  let qtdMaqMenorDsmp = dados_json.filter(dado => dado.desempenho < 35).length;
  let qtdMaqCrit = dados_json.filter(dado => dado.desempenho < 10).length;
  // let totalAlertas = dados_json.reduce((acc, curr) => acc + (parseInt(curr.critico) || 0), 0);

  document.getElementById('kpi_total').innerText = qtdMaquinas;
  document.getElementById('kpi_baixo').innerText = qtdMaqMenorDsmp;
  document.getElementById('kpi_alertas').innerText = qtdMaqCrit;
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
    // slc_filial.innerHTML = `<option disabled value="null">Selecione um aeroporto</option>`;
    slc_filial.innerHTML += `<option selected value="">Todos os meus aeroportos</option>`;

    filiais = [];

    for (const filialAtual of json_filiais) {
      let nomeExibido;

      switch (filialAtual.terminal) {
        case "1":
          nomeExibido = "GRU";
          break;
        case "2":
          nomeExibido = "SDU";
          break;
        default:
          nomeExibido = filialAtual.terminal;
      }

      slc_filial.innerHTML += `<option value="${filialAtual.terminal}">${nomeExibido}</option>`;
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
    dadosFiltrados = dadosFiltrados.filter(maq => maq.desempenho >= 65);
  } 
  else if (filtroDesempenhoSelecionado === "amarelo") {
    dadosFiltrados = dadosFiltrados.filter(maq => maq.desempenho >= 35 && maq.desempenho < 65);
  } 
  else if (filtroDesempenhoSelecionado === "vermelho") {
    dadosFiltrados = dadosFiltrados.filter(maq => maq.desempenho >= 10 && maq.desempenho < 35);
  }
  else if (filtroDesempenhoSelecionado === "roxo") {
    dadosFiltrados = dadosFiltrados.filter(maq => maq.desempenho < 10);
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
  const nomesTerminais = {
    "1": "GRU",
    "2": "SDU"
  };

  maquinas.forEach(maq => {
    const terminal = maq.terminal;
    const desempenho = parseFloat(maq.desempenho ?? 0);
    const critico = parseInt(maq.critico) || 0;
    const alto = parseInt(maq.alto) || 0;
    const peso = ((critico * 2) + (alto * 1)) / 28;

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
      terminal: nomesTerminais[terminal] || terminal,
      desempenho: parseFloat(desempenhoFinal.toFixed(1))
    });
  }

  desempenhoPorTerminal.sort((a, b) => a.desempenho - b.desempenho);

  const labels = desempenhoPorTerminal.map(d => d.terminal);
  const valores = desempenhoPorTerminal.map(d => d.desempenho);
  const cores = desempenhoPorTerminal.map(d => {
    if (d.desempenho <= 10) return '#8537C8';
    if (d.desempenho <= 35) return '#DE2828';
    if (d.desempenho <= 65) return '#f9e01f';
    return '#00A100';
  });

  console.log("Labels do grafico: ", labels)

  const options = {
    chart: {
      type: 'bar',
      height: 500,
      animations: {
        enabled: true
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '30%',
        distributed: true
      }
    },
    dataLabels: {
      enabled: true,
      formatter: val => `${val}%`,
      style: {
        fontWeight: 'bold',
        fontSize: '22px',
        colors: ['#000000']
      }
    },
    tooltip: {
      y: {
        formatter: val => `${val}%`
      }
    },
    xaxis: {
      categories: labels,
      max: 100,
      labels: {
        formatter: val => `${val}%`,
        style: {
          fontSize: '16px',
          fontWeight: 'bold'
        }
      },
      title: {
        text: 'Desempenho',
        style: {
          fontSize: '20px',
          fontWeight: 'bold'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Aeroportos',
        style: {
          fontSize: '20px',
          fontWeight: 'bold'
        }
      },
      labels: {
        style: {
          fontSize: '20px',
          fontWeight: 'bold'
        }
      }
    },
    series: [{
      name: 'Desempenho',
      data: valores
    }],
    colors: cores
  };

  if (apexChart) {
    apexChart.updateOptions(options);
  } else {
    apexChart = new ApexCharts(document.querySelector("#graficoDesempenho"), options);
    apexChart.render();
  }
}


window.onload = async function () {
  await getIdUsuario();
  await listarFiliais();
  await dashDudu();
};