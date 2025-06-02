var database = require("../database/config.js");

function getAlertas() {
    var instrucaoSql = `
        SELECT * FROM view_alertas_ultimos_3_meses_ram_cpu;
    `;

    return database.executar(instrucaoSql);
}

function getAlertasNivel() {
    var instrucaoSql = `
        SELECT 
            c.componente AS componente, 
            ca.gravidade, 
            COUNT(*) AS quantidade_alertas
        FROM 
            captura_alerta ca
        JOIN 
            metrica m ON ca.fkMetrica = m.idMetrica
        JOIN 
            componente c ON m.fkComponente = c.idComponente
        WHERE 
            c.componente IN ('Processador', 'RAM')
        GROUP BY 
            c.componente, ca.gravidade
        ORDER BY 
            c.componente, ca.gravidade;
    `;

    return database.executar(instrucaoSql);
}

module.exports = {
    getAlertas,
    getAlertasNivel
}
