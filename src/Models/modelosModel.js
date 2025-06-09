const cli = require("nodemon/lib/cli");
var database = require("../database/config");

function listarMetricasEComponente(fkFilial) {
    var instrucaoSql = `
   SELECT * from detalhes_Modelo where fkFilial =${fkFilial};

    `;
    console.log(`Listando metricas...`)
    return database.executar(instrucaoSql);
}

function filtroHistoricoModelo(maquinaID) {
    var instrucaoSql = `
    SELECT
    DAY(a.momento) AS Dia,
    YEAR(a.momento) AS Ano,
    MONTH(a.momento) AS Mes,
    c.componente AS Componente,
    m.idMaquina,
    COUNT(*) AS total_alertas
FROM captura_alerta a
LEFT JOIN metrica me ON a.fkMetrica = me.idMetrica
LEFT JOIN componente c ON me.fkComponente = c.idComponente
LEFT JOIN maquina m ON c.fkMaquina = m.idMaquina
LEFT JOIN filial f ON m.fkFilial = f.idFilial
WHERE m.idMaquina= ${maquinaID}
  AND a.momento >= NOW() - INTERVAL 30 DAY
GROUP BY
    DAY(a.momento),
    YEAR(a.momento),
    MONTH(a.momento),
    m.idMaquina,
    c.componente
ORDER BY
    Dia ASC,
    Ano ASC,
    Mes ASC,
    CASE c.componente
        WHEN 'Processador' THEN 1
        WHEN 'RAM' THEN 2
        WHEN 'Disco' THEN 3
        WHEN 'REDE' THEN 4
        ELSE 5
    END ASC;
    `;
    console.log(`Período selecionado`)
    return database.executar(instrucaoSql);
}

module.exports = {
    filtroHistoricoModelo,
    listarMetricasEComponente
}; 