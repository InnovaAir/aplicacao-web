var database = require("../database/config");

function dashGerenteDados(idUsuario){
        var instrucaoSql = `select * from dashRobertoModelos where idUsuario = ${idUsuario}`;
    console.log("Executando instrução:", instrucaoSql)
    return database.executar(instrucaoSql);
}

function dashGerenteDadosQtd(modelo1, modelo2, modelo3, modelo4, modelo5, idUsuario){
        var instrucaoSql = `select count(especificacao) as qtdMaquinas, especificacao, fkMaquina from componente join maquina on fkMaquina = idMaquina join filial on maquina.fkFilial = idFilial join usuarioFilial on usuarioFilial.fkFilial = idFilial join usuario on fkUsuario = idUsuario where especificacao = '${modelo1}' or especificacao = '${modelo2}' or especificacao = '${modelo3}'  or especificacao = '${modelo4}'  or especificacao = '${modelo5}' and idUsuario = ${idUsuario} group by fkMaquina, especificacao;`;
    console.log("Executando instrução:", instrucaoSql)
    return database.executar(instrucaoSql);
}

module.exports = {
dashGerenteDados,
dashGerenteDadosQtd
}