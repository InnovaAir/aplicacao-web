var usuarioModel = require("../Models/usuariosModel");

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var razaoSocial = req.body.razaoSocialServer;
    var email = req.body.emailServer;
    var telefone = req.body.telefoneServer;
    var responsavel = req.body.responsavelServer;
    var cnpj = req.body.cnpjServer;
    var senha = req.body.senhaServer;

    // Faça as validações dos valores
    if (!razaoSocial) {
        return res.status(400).json({ error: "Sua Razão Social está faltando!" });
    }
    if (!email) {
        return res.status(400).json({ error: "Seu email está faltando!" });
    }
    if (!telefone) {
        return res.status(400).json({ error: "Seu telefone está faltando!" });
    }
    if (!responsavel) {
        return res.status(400).json({ error: "Seu responsável está faltando!" });
    }
    if (!cnpj) {
        return res.status(400).json({ error: "Seu CNPJ está faltando!" });
    }
    if (!senha) {
        return res.status(400).json({ error: "Sua senha está faltando!" });
    } else {
    
        usuarioModel.cadastrar(razaoSocial, cnpj, email, telefone, responsavel, senha)
    .then((resultado) => {
        res.json(resultado); 
    })
    .catch((erro) => {
        console.log("Erro ao cadastrar:", erro);
        res.status(500).json({ error: "Erro ao cadastrar no banco de dados!" });
    });

    }
}


function cadastrarFuncionario(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var cliente = req.body.clienteServer;
    var cargo = req.body.cargoServer;

    // Faça as validações dos valores
    if (!nome) {
        return res.status(400).json({ error: "Seu nome está faltando!" });
    }
    if (!email) {
        return res.status(400).json({ error: "Seu email está faltando!" });
    }
    if (!senha) {
        return res.status(400).json({ error: "Sua senha está faltando!" });
    }
    if (!cliente) {
        return res.status(400).json({ error: "O cliente está faltando!" });
    }
    if (!cargo) {
        return res.status(400).json({ error: "O cargo está faltando!" });
    } else {
    
        usuarioModel.cadastrarFuncionario(nome, email, senha, cliente, cargo)
    .then((resultado) => {
        res.json(resultado); 
    })
    .catch((erro) => {
        console.log("Erro ao cadastrar:", erro);
        res.status(500).json({ error: "Erro ao cadastrar no banco de dados!" });
    });

    }
}

function entrar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está invalido!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {
        usuarioModel.entrar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    if (resultadoAutenticar.length == 1) {
                        if (resultadoAutenticar[0].email){
                            console.log(resultadoAutenticar);
                            // Adicionando validacao para saber se o usuario e a senha esta exatamente igual ao que esta no banco de dados
                            // e retornando mensagem de erro caso não esteja.
                            console.log(resultadoAutenticar);
                            res.json({
                                id: resultadoAutenticar[0].idUsuario,
                                nome: resultadoAutenticar[0].nome,
                                email: resultadoAutenticar[0].email,
                                senha: resultadoAutenticar[0].senha,
                                cliente: resultadoAutenticar[0].fkCliente,
                                cargo: resultadoAutenticar[0].fkCargo
                            });
                        }

                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function listarCargo(req,res){
    usuarioModel.listarCargo()
    .then(function (resultado) {
      if (resultado.length > 0) {
        console.log(`Passei pelo retorno do controller`);
        res.status(200).json(resultado);
      } else {
        res.status(204).send("Nenhum resultado encontrado!");
      }
    })
    .catch(function (erro) {
      console.log(erro);
      console.log("Houve um erro ao buscar os dados: ", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}

function listarFiliais(req,res){
    usuarioModel.listarFiliais()
    .then(function (resultado) {
      if (resultado.length > 0) {
        console.log(`Passei pelo retorno do controller`);
        res.status(200).json(resultado);
      } else {
        res.status(204).send("Nenhum resultado encontrado!");
      }
    })
    .catch(function (erro) {
      console.log(erro);
      console.log("Houve um erro ao buscar os dados: ", erro.sqlMessage);
      res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    cadastrar,
    cadastrarFuncionario,
    entrar,
    listarCargo,
    listarFiliais
}

