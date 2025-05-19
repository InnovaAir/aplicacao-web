var database = require("../database/config");

function dashGerenteDados(idUsuario){
        var instrucaoSql = `
        SELECT valorCapturado, momento, metrica, gravidade, limiteMaximo, limiteMinimo, componente, especificacao, fkFilial from captura_alerta join metrica on fkMetrica = idMetrica join componente on fkComponente = idComponente join maquina on fkMaquina = idMaquina join filial on fkFilial = idFilial where idUsuario = ${idUsuario};
    `;
    console.log("Executando instrução:", instrucaoSql)
    return database.executar(instrucaoSql);
}

module.exports = {
dashGerenteDados
}