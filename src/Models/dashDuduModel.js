var database = require("../database/config");

const buscarDesempenho = async () => {
  var sql = `
    SELECT * FROM Usuario;
  `;

  return database.executar(sql);
};



module.exports = {
  buscarDesempenho
};
