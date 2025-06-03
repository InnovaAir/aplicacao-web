var avisoModel = require("../Models/modelLeticia");

function getAlertas(req, res) {
    avisoModel.getAlertas()
        .then((resultado) => {
            res.json(resultado);
        }).catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar os avisos: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function getAlertasNivel(req, res) {
    avisoModel.getAlertasNivel()
        .then((resultado) => {
            res.json(resultado);
        }).catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar os avisos: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function getEndereco(req, res) {
    avisoModel.getEndereco()
        .then((resultado) => {
            res.json(resultado);
        }).catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar os avisos: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

module.exports = {
    getAlertas,
    getAlertasNivel,
    getEndereco
}