sessionStorage.idFilial = null;

totensAlerta = 0;
totensOciosos = 0;
totensNormal = 0;
idMaquina = 0;
filiais = [];
dados_json = [];

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
  console.log(dados)
  console.log(dados[0].critico)
  qtdMaquinas = dados.length;
  qtdMaqMenorDsmp = dados.filter(dado => dado.desempenho < 35).length
  total = 0;
  for(i = 0; i < dados.length; i++){
    total += parseInt(dados[i].critico)
  }

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
      <div class="coluna">${maq.terminal || '-'}</div>
      <div class="coluna">${maq.critico || 0}</div>
      <div class="coluna">${maq.alto || 0}</div>
      <div class="coluna">${maq.baixo || 0}</div>
      <div class="coluna">${maq.total_alertas || 0}</div>
      <div class="coluna">${maq.desempenho !== undefined ? maq.desempenho + '%' : 'N/A'}</div>
    `;
    lista.appendChild(div);

    kpi_total.innerHTML = qtdMaquinas;
    kpi_baixo.innerHTML = qtdMaqMenorDsmp;
    kpi_alertas.innerHTML = total

  });
}

// Fetch 1
console.log("Entrando no fetch");

async function dashDudu(){
await fetch(`/dashDuduRoutes/dash-dudu/${sessionStorage.idUsuario}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
          })        
  .then(res => res.json())
  .then(data => {
    dados_json = data
    console.log("fetch 1");
    console.log('Entrei no fetch e tenho esses dados:', data);  
    carregarMaquinas(data);

  })
  .catch(err => console.error('Erro ao carregar os dados:', err));
}

// Fetch 3
async function getIdUsuario(){
await fetch(`/dashDuduRoutes/getIdUsuario/${sessionStorage.idUsuario}`)
  .then(res => res.json())
  .then(data => {
    console.log('Entrei no fetch e tenho esses dados:', data);
    carregarMaquinas(data);
  })
  .catch(err => console.error('Erro ao carregar os dados:', err));
}

// Listando endereços
// fetch('/dashDuduRoutes/enderecos')
//   .then(res => res.json())
//   .then(data => {
//     const enderecoSelect = document.getElementById('slc_endereco');
//     data.forEach(endereco => {
//       const label = `${endereco.cidade} - ${endereco.bairro} - ${endereco.logradouro}, ${endereco.numero}`;
//       const option = document.createElement('option');
//       option.value = endereco.idEndereco;
//       option.textContent = label;
//       enderecoSelect.appendChild(option);
//     });
//   })
//   .catch(err => console.error('Erro ao carregar endereços:', err));


// document.getElementById('slc_endereco').addEventListener('change', (e) => {
//   const idEndereco = e.target.value;
//   const filialSelect = document.getElementById('slc_filial');
//   filialSelect.innerHTML = '<option value="">Filial</option>';

//   if (!idEndereco) return;

async function listarFiliais(){
await fetch(`/cadastros/metricas/listar/filiais/${sessionStorage.idUsuario}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((answer) => {
                answer.json().then(json_select => {
                    json_filiais = json_select;

                    // var select_aeroporto = document.getElementById("slc_filial");

                    slc_filial.innerHTML = `<option disabled value="null">Selecione um aeroporto</option>`
                    slc_filial.innerHTML += `<option selected value="">Todos os meus aeroportos</option>`

                    for (let i = 0; i < json_filiais.length; i++) {
                        var filialAtual = json_filiais[i];

                        slc_filial.innerHTML += `<option value="${filialAtual.terminal}">${filialAtual.terminal}</option>`
                    }
                    for(i = 0; i < json_filiais.length; i++){
                      filiais.push(json_filiais[i].terminal)
                    }
                })
            })
            .catch(() => {
                print("Erro ao realizar o Fetch")
            });
    }

  async function aplicarFiltro(){
    var aeroportos = document.getElementById("slc_filial")
    var aeroporto = aeroportos.value;
    dados_filtrados = dados_json;
    const semanas = {
      "1": 1,
      "2": 2,
      "4": 4
    }
  
  console.log(filiais)
  console.log(aeroporto)
  // filtro endereco
  if(filiais.indexOf(aeroporto) != -1){
    var dados_filtrados2 = [];
        indice = filiais.indexOf(aeroporto)
      for (i = 0; i < dados_filtrados.length; i++){
      if(dados_filtrados[i].terminal == filiais[indice]){
        dados_filtrados2.push(dados_json[i])
    }
    }
    dados_filtrados = dados_filtrados2
    console.log(dados_filtrados)
  }
  carregarMaquinas(dados_filtrados)
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

async function executar(){
await getIdUsuario()
await listarFiliais()
await dashDudu()
aplicarFiltro()
}
executar()