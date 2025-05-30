var dashDuduModel = require('../Models/dashDuduModel');

var calcularDesempenho = (linha) => {
  var perdas = (linha.critico * 2) + (linha.alto * 1);
  return Math.max(0, 100 - perdas);
};

var obterDesempenho = async (req, res) => {
  try {

    var idUsuario = req.params.idUsuario;
    let dados = await dashDuduModel.listarDesempenhoPorFilial(idUsuario);

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

  console.log("cheguei no controller qtdMaqMenorDsmp");

  dashDuduModel.qtdMaqMenorDsmp()
    .then(resultado => {
      console.log("Resultado da model no controller:", resultado);
      if (resultado.length > 0) {
        res.send(resultado[0].qtd_maquinas_abaixo_35.toString());
      } else {
        if (resultado.length > 0) {
          res.send(resultado[0].qtd_maquinas_abaixo_35.toString());
        } else {
          res.send("0");
        }
      }
    })
    .catch(erro => {
      console.error("Erro no controller:", erro);
      res.status(500).send("Erro ao buscar dados");
    });
}

function getIdUsuario(req, res){
  var idUsuario = req.params.idUsuario;

  if (!idUsuario) {
    return res.status(400).send("Deu ruim, id nulo");
  }

  dashDuduModel.getIdUsuario(idUsuario)
    .then((resultado) => {
      console.log("Resultado do getIdUsuario:", resultado);
      res.json(resultado);
    })
    .catch((erro) => {
      console.log("Erro ao obter dados do gerente:", erro);
      res.status(500).json({ error: "Erro ao obter dados do gerente" });
    });
}


function getTotalMaq(req, res) {
  var idFilial = req.query.idFilial;

  dashDuduModel.getTotalMaq(idFilial)
    .then((resultado) => {
      res.json(resultado);
    })
    .catch((erro) => {
      console.log("Erro ao obter total de máquinas:", erro);
      res.status(500).json({ erro: "Erro ao obter total de máquinas" });
    });
}

// async function listarEnderecos(req, res) {
//   try {
//     const dados = await dashDuduModel.listarEnderecos();
//     res.status(200).json(dados);
//   } catch (erro) {
//     console.error('Erro ao obter endereços:', erro);
//     res.status(500).json({ erro: 'Erro ao obter endereços' });
//   }
// }

// async function listarFiliais(req, res) {
//   try {
//     const idEndereco = req.params.idEndereco;
//     const dados = await dashDuduModel.listarFiliais(idEndereco);
//     res.status(200).json(dados);
//   } catch (erro) {
//     console.error('Erro ao obter filiais:', erro);
//     res.status(500).json({ erro: 'Erro ao obter filiais' });
//   }
// }



module.exports = {
  obterDesempenho,
  qtdMaqMenorDsmp,
  getTotalMaq,
  // listarEnderecos,
  // listarFiliais,
  getIdUsuario
};