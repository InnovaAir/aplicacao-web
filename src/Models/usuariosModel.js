var database = require("../database/config");

function cadastrar(razaoSocial, email, telefone, responsavel, cnpj, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", razaoSocial, email, telefone, responsavel, cnpj, senha);

    var instrucaoSqlCliente = `
        INSERT INTO cliente (razaoSocial, cnpj, email, telefone) 
        VALUES ('${razaoSocial}', '${cnpj}', '${email}', '${telefone}');
    `;

    console.log("Executando a instrução SQL Cliente: \n" + instrucaoSqlCliente);

    return database.executar(instrucaoSqlCliente)
        .then((resultadoCliente) => {
            console.log("Cliente inserido com sucesso: ", resultadoCliente);

            var instrucaoSqlUsuario = `
                INSERT INTO usuario (responsavel, email, senha, fkCliente) 
                VALUES ('${responsavel}', '${email}', '${senha}', '${resultadoCliente.insertId}');
            `;
        
            console.log("Executando a instrução SQL Usuário: \n" + instrucaoSqlUsuario);

            return database.executar(instrucaoSqlUsuario);
        })
        .then((resultadoUsuario) => {
            console.log("Usuário inserido com sucesso: ", resultadoUsuario);
            return resultadoUsuario;
        })
        .catch((erro) => {
            console.log("Erro ao cadastrar: ", erro);
            throw erro;
        });
}

// function autenticar(email, senha) {
//     console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function autenticar(): ", email, senha)
//     var instrucaoSql = `
//         SELECT * FROM usuario WHERE email = '${email}' AND senha = '${senha}';
//     `;
//     console.log("Executando a instrução SQL: \n" + instrucaoSql);
//     return database.executar(instrucaoSql);
// }

function entrar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function autenticar(): ", email, senha)
    var instrucaoSql = `
        SELECT * FROM usuario WHERE email = '${email}' AND senha = '${senha}';
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar,
    entrar
};
