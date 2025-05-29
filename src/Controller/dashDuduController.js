var dashDuduModel = require('../Models/dashDuduModel');

var calcularDesempenho = (linha) => {
  var perdas = (linha.critico * 2) + (linha.alto * 1);
  return Math.max(0, 100 - perdas);
};

var obterDesempenho = async (req, res) => {
  try {
    // var idFilial = 1;
    var idFilial = req.query.idFilial;
    let dados = await dashDuduModel.listarDesempenhoPorFilial(idFilial);

    console.log("Dados model:", dados);

    var resultado = dados.map(linha => ({
      ...linha,
      desempenho: calcularDesempenho(linha)
    }));

    res.json(resultado);
  } catch (erro) {
    console.error('Erro ao buscar desempenho:', erro);
    res.status(500).json({ erro: 'Erro ao buscar desempenho' });
  }
};

function qtdMaqMenorDsmp(req, res){
  var idMaquina = req.params.idMaquina;

  dashDuduModel.qtdMaqMenorDsmp(idMaquina)
            .then((resultado) => {
              console.log(resultado)
            })
            .catch((erro) => {
                console.log("Erro ao obter dados do gerente:", erro);
                res.status(500).json({ error: "Erro ao obter dados do gerente" });
            });

    if (idMaquina == null) {
          res.status(500).send("Deu ruim, id nulo")
    }
    else {
      console.log("idMaquinas: ", idMaquina)
      res.json();

    }
}

function getIdUsuario(req, res){
  var idUsuario = req.params.idUsuario;

  dashDuduModel.getIdUsuario(idUsuario)
  .then((resultado) => {
              console.log(resultado)
            })
            .catch((erro) => {
                console.log("Erro ao obter dados do gerente:", erro);
                res.status(500).json({ error: "Erro ao obter dados do gerente" });
            });

    if (idUsuario == null) {
          res.status(500).send("Deu ruim, id nulo")
    }
    else {
      console.log("idUsuario: ", idUsuario)
      res.json();

    }
}


module.exports = {
  obterDesempenho,
  qtdMaqMenorDsmp,
  getIdUsuario
};