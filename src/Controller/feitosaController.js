var feitosaModel = require("../Models/feitosaModel");

function getAlertas(req, res) {
    var idMaquina = req.params.idMaquina;

    if (idMaquina == null) {
        res.status(500).send("ID Máquina está nulo!")
    }

    feitosaModel.getAlertas(idMaquina, today=true)
    .then((answer) => {
        res.status(200).json(answer)
    })
}

function getEnderecos(req, res) {
    
    feitosaModel.getEnderecos()
    .then((answer) => {
        res.status(200).json(answer)
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

module.exports = {
    getAlertas,
    getID,
    getEnderecos,
}

