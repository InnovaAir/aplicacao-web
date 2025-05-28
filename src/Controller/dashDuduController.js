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
      Desempenho: calcularDesempenho(linha)
    }));

    res.json(resultado);
  } catch (erro) {
    console.error('Erro ao buscar desempenho:', erro);
    res.status(500).json({ erro: 'Erro ao buscar desempenho' });
  }
};

module.exports = {
  obterDesempenho
};