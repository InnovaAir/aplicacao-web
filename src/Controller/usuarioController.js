const e = require("express");
var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está indefinido!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);

                        res.json(resultadoAutenticar[0])

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

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    // variaveis do usuárioModel.js
    var usuario = req.body.usuarioServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var dtNasc = req.body.dtNascServer;
    var persoFav = req.body.persoFavServer;
    var arcoFav = req.body.arcoFavServer;
    var idUsuario;

    // Faça as validações dos valores
    if (usuario == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (dtNasc == undefined) {
        res.status(400).send("Sua data de nascimento está undefined!");
    } else if (persoFav == undefined) {
        res.status(400).send("Seu personagem favorito está undefined!");
    } else if (arcoFav == undefined) {
        res.status(400).send("Seu arco favorito está undefined!");
    } else {
        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(usuario, email, senha, dtNasc, persoFav, arcoFav)
            .then(
                function (resultado) {
                    usuarioModel.obterId(usuario, email, senha)
                        .then(
                            function (resultado) {
                                usuarioModel.registrarLeitura(resultado[0].idUsuario)
                   
                            }
                        ).catch (
                            function (erro) {
                                console.log(erro);
                                console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                                res.status(500).json(erro.sqlMessage);
                            }
                        )
                    res.json(resultado);

                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

module.exports = {
    autenticar,
    cadastrar
}