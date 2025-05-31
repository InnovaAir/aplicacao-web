const cli = require("nodemon/lib/cli");
var database = require("../database/config");

function listarMetricasEComponente(fkFilial) {
    var instrucaoSql = `
     SELECT 
    maquina.idMaquina,
    maquina.numeroSerial,
    maquina.enderecoMac,
    maquina.nomeModelo,
    maquina.hostname,
    maquina.fkFilial,
    componente.componente,
    componente.especificacao,
    metrica.metrica,
    metrica.limiteMinimo,
    metrica.limiteMaximo,
    metrica.fkComponente,
    metrica.idMetrica,
    captura_alerta.valorCapturado,
    captura_alerta.momento,
    captura_alerta.gravidade
FROM maquina
LEFT JOIN componente ON componente.fkMaquina = maquina.idMaquina
LEFT JOIN metrica ON metrica.fkComponente = componente.idComponente
LEFT JOIN captura_alerta ON captura_alerta.fkMetrica = metrica.idMetrica
WHERE maquina.fkFilial = ${fkFilial};

    `;
    console.log(`Listando metricas...`)
    return database.executar(instrucaoSql);
}
 module.exports = {
    listarMetricasEComponente
}; 