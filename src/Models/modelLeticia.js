var database = require("../database/config.js");

function getAlertas() {
    var instrucaoSql = `
        SELECT * FROM view_alertas_ultimos_3_meses_ram_cpu;
    `;

    return database.executar(instrucaoSql);
}

function getAlertasNivel() {
    var instrucaoSql = `
        SELECT * FROM view_gravidade;
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
