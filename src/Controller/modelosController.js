var modelosModel = require("../Models/modelosModel");

function listarMetricasEComponente(req, res) {
    var fkComponente = req.params.fk;

    // Faça as validações dos valores    
    if (fkComponente == null) {
        res.status(400).send("ID do componente está nulo!");
    }

    modelosModel.listarMetricasEComponente(fkComponente)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((erro) => {
            console.log("Erro ao cadastrar:", erro);
            res.status(500).json({ error: "Erro ao cadastrar no banco de dados!" });
        });
}

function filtroHistoricoModelo(req, res) {
    var idMaquina = req.params.fk;

    // Faça as validações dos valores    
    if (idMaquina == null) {
        res.status(400).send("ID da maquina está nulo!");
    }

    modelosModel.filtroHistoricoModelo(idMaquina)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((erro) => {
            console.log("Erro ao cadastrar:", erro);
            res.status(500).json({ error: "Erro ao cadastrar no banco de dados!" });
        });
}

module.exports = {
    listarMetricasEComponente,
    filtroHistoricoModelo
};