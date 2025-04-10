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

module.exports = {
    cadastrar,
    autenticar
}

