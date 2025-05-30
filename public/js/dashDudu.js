totensAlerta = 0;
totensOciosos = 0;
totensNormal = 0;
idMaquina = 0;

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

  carregarMaquinas();
}

function carregarMaquinas(dados) {
  var lista = document.getElementById('lista_maquinas');
  lista.innerHTML = '';

  dados.forEach(maq => {
    var desempenho = maq.desempenho != null ? maq.desempenho.toFixed(0) : 'N/A';

    var classe = 'green';
    if (desempenho !== 'N/A') {
      var valor = parseInt(desempenho);
      if (valor < 30) classe = 'red';
      else if (valor < 70) classe = 'yellow';
    }

    var div = document.createElement('div');
    div.className = `totem ${classe}`;
    div.innerHTML = `
      <div class="coluna">${maq.totem || '-'}</div>
      <div class="coluna">${maq.filial || '-'}</div>
      <div class="coluna">${maq.critico || 0}</div>
      <div class="coluna">${maq.alto || 0}</div>
      <div class="coluna">${maq.baixo || 0}</div>
      <div class="coluna">${maq.total_alertas || 0}</div>
      <div class="coluna">${maq.desempenho !== undefined ? maq.desempenho + '%' : 'N/A'}</div>
    `;
    lista.appendChild(div);
  });
}

console.log("Entrando no fetch");

fetch('/dashDuduRoutes/dash-dudu')
  .then(res => res.json())
  .then(data => {
    console.log("fetch 1");
    console.log('Entrei no fetch e tenho esses dados:', data);  
    carregarMaquinas(data);
  })
  .catch(err => console.error('Erro ao carregar os dados:', err));

// ARRUMAR ESSA ROTA PQ ELA N TA DEVOLVENDO NADA
console.log("fetch 2");

fetch(`/dashDuduRoutes/qtdMaqMenorDsmp/${idMaquina}`)
  .then(response => response.text())
  .then(data => {
    console.log("Entrei no fetch e tenho esses dados:", data);

    // Exibir o valor recebido em algum lugar da página
    const qtdElemento = document.getElementById("kpi_baixo");
    if (qtdElemento) {
      qtdElemento.textContent = data;
    }
  })
  .catch(err => {
    console.error("Erro ao carregar os dados:", err);
  });



// fetch(`/dashDuduRoutes/getIdUsuario/${sessionStorage.idUsuario}`)
// console.log("fetch 3")
//   .then(res)
//   .then(data => {
//     console.log('Entrei no fetch e tenho esses dados:', data);
//     carregarMaquinas(data);
//   })
//   .catch(err => console.error('Erro ao carregar os dados:', err));


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