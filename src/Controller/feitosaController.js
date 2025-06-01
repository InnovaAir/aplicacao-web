var feitosaModel = require("../Models/feitosaModel");

function getAlertas(req, res) {
    var idMaquina = req.params.idMaquina;

    if (idMaquina == null) {
        res.status(500).send("ID Máquina está nulo!")
    }

    feitosaModel.getAlertas(idMaquina)
    .then((answer) => {
        res.status(200).send(answer)
    })
}

function getEnderecos(req, res) {

    var idMaquina = req.params.idMaquina
    
    feitosaModel.getEnderecos(idMaquina)
    .then((answer) => {
        console.log(answer)
        res.status(200).json(answer)
    })
}

function getIDComponentes(req, res) {
    idMaquina = req.params.idMaquina;
    
    console.log(componente)

    feitosaModel.getIDComponentes(idMaquina, componente)
    .then((querry) => {
        res.status(200).send(querry)
    })
}

function getID(placaMae) {
    if (placaMae == null || placaMae == "") {
        return null
    }

    feitosaModel.getID(placaMae)
    .then((answer) => {
        return answer
    })
    
}

function obterMaquinasDoEnderecos(req, res) {
    feitosaModel.listarEnderecoTotens()
    .then((querry) => {
        if (querry.length == 0) {
            res.status(204).send("Sem conteúdo")
        } else {
            res.status(200).send(querry)
        }
    })

}

module.exports = {
    getAlertas,
    getID,
    getEnderecos,
    getIDComponentes,
    obterMaquinasDoEnderecos
}

