const cli = require("nodemon/lib/cli");
var database = require("../database/config");

function listarMetricasEComponente(fkFilial) {
    var instrucaoSql = `
    SELECT * from detalhesmodelo where fkFilial = ${fkFilial};

    `; 
    console.log(`Listando metricas...`)
    return database.executar(instrucaoSql);
}
 module.exports = {
    listarMetricasEComponente
}; 