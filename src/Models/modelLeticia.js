var database = require("../database/config.js");

function getAlertas() {
    var instrucaoSql = `
        SELECT * FROM view_alertas_ultimos_3_meses;
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    getAlertas
}
