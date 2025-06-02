const dashDuduModel = require('../Models/dashDuduModel');

const calcularDesempenho = (linha) => {
  const critico = Number(linha.critico) || 0;
  const alto = Number(linha.alto) || 0;
  const baixo = Number(linha.baixo) || 0;

  const perdas = (critico * 5) + (alto * 2) + (baixo * 1);
  
  const desempenho = Math.max(0, 100 - perdas);
  
  return desempenho;
};

const obterDesempenho = async (req, res) => {
  try {
    const idUsuario = req.params.idUsuario;
    const dados = await dashDuduModel.listarDesempenhoPorFilial(idUsuario);

    console.log("Dados model:", dados);

    const resultado = dados.map(linha => ({
      ...linha,
      desempenho: calcularDesempenho(linha)
    }));

    res.json(resultado);
  } catch (erro) {
    console.error('Erro ao buscar desempenho:', erro);
    res.status(500).json({ erro: 'Erro ao buscar desempenho' });
  }
};

async function qtdMaqMenorDsmp(req, res) {
  console.log("cheguei no controller qtdMaqMenorDsmp");

  try {
    const resultado = await dashDuduModel.qtdMaqMenorDsmp();

    console.log("Resultado da model no controller:", resultado);

    if (resultado.length > 0) {
      res.send(resultado[0].qtd_maquinas_abaixo_35.toString());
    } 
    else {
      res.send("0");
    }
  } catch (erro) {
    console.error("Erro no controller:", erro);
    res.status(500).send("Erro ao buscar dados");
  }
}

async function getIdUsuario(req, res) {
  const idUsuario = req.params.idUsuario;

  if (!idUsuario) {
    return res.status(400).send("Deu ruim, id nulo");
  }

  try {
    const resultado = await dashDuduModel.getIdUsuario(idUsuario);
    console.log("Resultado do getIdUsuario:", resultado);
    res.json(resultado);
  } catch (erro) {
    console.log("Erro ao obter dados do gerente:", erro);
    res.status(500).json({ error: "Erro ao obter dados do gerente" });
  }
}

module.exports = {
  obterDesempenho,
  qtdMaqMenorDsmp,
  getIdUsuario
};
