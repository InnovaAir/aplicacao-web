var database = require("../database/config");

function dashGerenteDados(idUsuario){
            var instrucaoSql = `select f.terminal, COUNT(a.idCapturaAlerta) AS total_alertas
                                from captura_alerta a
                                join metrica me on a.fkMetrica = me.idMetrica
                                join componente c ON me.fkComponente = c.idComponente
                                join maquina m ON c.fkMaquina = m.idMaquina
                                join filial f ON m.fkFilial = f.idFilial
                                where f.fkcliente = 2
                                group by f.terminal
                                order by f.terminal, total_alertas desc;`;
    console.log("Executando instrução:", instrucaoSql)
    return database.executar(instrucaoSql);
}

module.exports = {
    dashGerenteDados
}