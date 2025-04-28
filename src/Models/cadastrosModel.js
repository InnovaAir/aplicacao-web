const cli = require("nodemon/lib/cli");
var database = require("../database/config");

function listarFiliais(idUsuario) {
    var instrucaoSql = `
        SELECT idFilial, terminal, setor from usuario join usuarioFilial on fkUsuario = idUsuario join filial on fkFilial = idFilial where idUsuario = ${idUsuario};
    `;
    console.log(`Listando filiais...`)
    return database.executar(instrucaoSql);
}

function listarTotens(fkFilial) {
    var instrucaoSql = `
        SELECT * FROM maquina WHERE fkFilial = ${fkFilial};
    `;
    console.log(`Listando totens...`)
    return database.executar(instrucaoSql);
}

function listarComponentes(fkMaquina) {
    var instrucaoSql = `
        SELECT * FROM componente WHERE fkMaquina = ${fkMaquina}
    `;
    console.log(`Listando componentes...`)
    return database.executar(instrucaoSql);
}

function listarMetricas(fkComponente) {
    var instrucaoSql = `
        SELECT * FROM metrica WHERE fkComponente = ${fkComponente}
    `;
    console.log(`Listando metrica...`)
    return database.executar(instrucaoSql);
}

function verMetrica(idMetrica) {
    var instrucaoSql = `
        SELECT * FROM metrica WHERE idMetrica = ${idMetrica}
    `;
    console.log(`Vendo metrica...`)
    return database.executar(instrucaoSql);
}

function adicionarMetrica(fkComponente, Metrica, limiteMax, limiteMin) {
    var instrucaoSql = "";

    instrucaoSql = `INSERT INTO metrica VALUES (default, '${Metrica}', ${limiteMax}, ${limiteMin},${fkComponente})`;

    console.log(`Adicionando metrica...`)
    return database.executar(instrucaoSql);
}

function atualizarMetrica(idMetrica, limiteMax, limiteMin) {
    var instrucaoSql = "";

    instrucaoSql = `UPDATE metrica SET limiteMaximo = ${limiteMax}, limiteMinimo = ${limiteMin} WHERE idMetrica = ${idMetrica}`;

    console.log(`Adicionando metrica...`)
    return database.executar(instrucaoSql);
}

function deletarMetrica(idMetrica) {
    var instrucaoSql = "";

    instrucaoSql = `DELETE FROM metrica WHERE idMetrica = ${idMetrica}`;

    console.log(`Adicionando metrica...`)
    return database.executar(instrucaoSql);
}

function listarEnderecos(idCliente) {
    var instrucaoSql = "";

    instrucaoSql = `
    SELECT e.* 
    FROM endereco as e 
    LEFT JOIN filial as f ON f.fkEndereco = e.idEndereco 
    LEFT JOIN cliente as c ON f.fkCliente = c.idCliente 
    WHERE f.fkEndereco IS NULL;
    `;

    console.log(instrucaoSql)
    console.log(`Listando endereços...`)
    return database.executar(instrucaoSql);
}

function verEndereco(idEndereco) {
    var instrucaoSql = "";

    instrucaoSql = `
    SELECT e.* 
    FROM endereco as e
    WHERE e.idEndereco = ${idEndereco};`;

    console.log(`Vendo endereço...`)
    return database.executar(instrucaoSql);
}

function atualizarEndereco(idEndereco, cep, logradouro, numero, complemento, bairro, cidade, estado) {
    var instrucaoSql = "";

    instrucaoSql = `
    UPDATE endereco SET 
    cep = '${cep}', 
    logradouro = '${logradouro}', 
    numero = '${numero}', 
    complemento = '${complemento}', 
    bairro = '${bairro}', 
    cidade = '${cidade}', 
    estado = '${estado}'
    WHERE idEndereco = ${idEndereco};
    `;

    console.log(`Atualizando endereço...`)
    return database.executar(instrucaoSql);
}

function adicionarEndereco(cep, logradouro, numero, complemento, bairro, cidade, estado) {
    var instrucaoSql = "";

    instrucaoSql = `
    INSERT INTO endereco VALUES (default, ${cep}, '${logradouro}', '${numero}', '${complemento}', '${bairro}', '${cidade}', '${estado}', 'no-info');`;

    console.log(instrucaoSql)

    console.log(`Adicionando endereço...`)
    return database.executar(instrucaoSql);
}

function deletarEndereco(idEndereco) {
    var instrucaoSql = "";

    instrucaoSql = `
    DELETE FROM endereco WHERE idEndereco = ${idEndereco};
    `;

    console.log(`Atualizando endereço...`)
    return database.executar(instrucaoSql);
}


module.exports = {
    listarFiliais,
    listarTotens,
    listarComponentes,
    listarMetricas,
    verMetrica,
    verEndereco,
    adicionarMetrica,
    atualizarMetrica,
    deletarMetrica,
    listarEnderecos,
    atualizarEndereco,
    adicionarEndereco,
    deletarEndereco,
};
