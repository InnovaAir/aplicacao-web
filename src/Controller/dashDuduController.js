var dashDuduModel = require('../Models/dashDuduModel');

var listarDesempenho = async (req, res) => {

  var resultado = await dashDuduModel.buscarDesempenho();
    res.json(resultado);
   
};

module.exports = {
  listarDesempenho
};
