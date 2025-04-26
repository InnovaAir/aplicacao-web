var database = require("../database/config");

function cadastrar(razaoSocial, cnpj, email, telefone, responsavel, senha) {
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
                INSERT INTO usuario (nome, email, senha, fkCliente, fkcargo) 
                VALUES ('${responsavel}', '${email}', '${senha}', '${resultadoCliente.insertId}', ${2});
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

function cadastrarFuncionario(nome, email, senha, cliente, cargo, filial) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():",nome , email, senha, cliente, cargo);

    var instrucaoSqlCliente = `
        INSERT INTO usuario (nome, email, senha, fkCliente, fkCargo) 
        VALUES ('${nome}', '${email}', '${senha}', 2, 2);
    `;

    console.log("Executando a instrução SQL Cliente: \n" + instrucaoSqlCliente);
    return database.executar(instrucaoSqlCliente)
        .then((resultadoCliente) => {
            console.log("Cliente inserido com sucesso: ", resultadoCliente);

            var instrucaoSqlUsuario = `
                INSERT INTO usuarioFilial (fkUsuario, fkFilial) 
                VALUES ('${resultadoCliente.insertId}', '${filial}');
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

function entrar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function autenticar(): ", email, senha)
    var instrucaoSql = `
        SELECT idUsuario, u.nome, u.email as email, u.fkCliente, u.fkCargo FROM usuario u
        join cliente c on c.idCliente = u.fkCliente
        WHERE u.email = '${email}' AND u.senha = '${senha}';
    `;
    // var instrucaoSql = `
    //     SELECT * FROM usuario
    //     WHERE email = '${email}' AND senha = '${senha}';
    // `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function listarCargo(){
    console.log("ACESSEI O AVISO  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listar_categorias()");
    console.log("Passei aqui");
    var instrucaoSql = `
        SELECT idcargo,nome FROM cargo;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
  }

function listarFiliais(){
    console.log("ACESSEI O AVISO  MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function listar_categorias()");
    console.log("Passei aqui");
    var instrucaoSql = `
        select * from filial;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
  }

module.exports = {
    cadastrar,
    cadastrarFuncionario,
    entrar,
    listarCargo,
    listarFiliais
};
