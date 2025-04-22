var usuarioModel = require("../Models/usuariosModel");

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var razaoSocial = req.body.razaoSocialServer;
    var email = req.body.emailServer;
    var telefone = req.body.telefoneServer;
    var responsavel = req.body.responsavelServer;
    var cnpj = req.body.cnpjServer;
    var senha = req.body.senhaServer;
    var confSenha = req.body.confimarServer;

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

    
        usuarioModel.cadastrar(razaoSocial, email, telefone, responsavel, cnpj, senha)
    .then((resultado) => {
        res.json(resultado); 
    })
    .catch((erro) => {
        console.log("Erro ao cadastrar:", erro);
        res.status(500).json({ error: "Erro ao cadastrar no banco de dados!" });
    });

    }
}

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (!email) {
        res.status(400).send("Seu email está undefined!");
    } else if (!senha) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`);

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);
                        res.json({
                            idEmpresa: resultadoAutenticar[0].idEmpresa,
                            email: resultadoAutenticar[0].email
                        })
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
                            // Adicionando validacao para saber se o usuario e a senha esta exatamente igual ao que esta no banco de dados
                            // e retornando mensagem de erro caso não esteja.
                            if (resultadoAutenticar[0].email == email && resultadoAutenticar[0].senha == senha) {
                                console.log(resultadoAutenticar);
                                res.json({
                                    id: resultadoAutenticar[0].idcadastro,
                                    email: resultadoAutenticar[0].email,
                                    nome: resultadoAutenticar[0].nome,
                                    senha: resultadoAutenticar[0].senha
                                });
                            }else{
                                div_mensagem.innerHTML = `<span style='color:#ff0000; font-weight:bold;'>Nome de usuário ou senha invalidos</span><br>`;
                            };
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

module.exports = {
    cadastrar,
    autenticar,
    entrar
}

