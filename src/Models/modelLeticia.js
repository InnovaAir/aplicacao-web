var database = require("../database/config.js");

function getAlertas() {
    var instrucaoSql = `
        SELECT * FROM view_grafico_linha;
    `;

    return database.executar(instrucaoSql);
}

function getAlertasNivel() {
    var instrucaoSql = `
        SELECT * FROM view_kpi_alerta;
    `;

    return database.executar(instrucaoSql);
}

function getEndereco() {
    var instrucaoSql = `
        SELECT usuario, aeroporto FROM view_endereco;
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    getAlertas,
    getAlertasNivel,
    getEndereco
}
