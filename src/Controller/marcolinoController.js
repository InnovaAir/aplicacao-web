var marcolinoModel = require("../Models/marcolinoModel");

function plotarFilial(req, res){
    fkCliente = req.body.fkClienteServer;
    
    marcolinoModel.plotarFilial(fkCliente)
    .then((resultado) => {
        res.json(resultado);
    })
    .catch((erro) => {
        console.log("Erro ao obter dados das filiais:", erro);
        res.status(500).json({ error: "Erro ao obter dados das filiais" });
    });
}
    
function plotarMensal(req, res){
    fkCliente = req.body.fkClienteServer;
    marcolinoModel.plotarMensal(fkCliente)
    .then((resultado) => {
        res.json(resultado);
    })
    .catch((erro) => {
        console.log("Erro ao obter dados de alertas:", erro);
        res.status(500).json({ error: "Erro ao obter dados de alertas" });
    });
}
    
function plotarKpi(req, res){
    fkCliente = req.body.fkClienteServer;
    marcolinoModel.plotarKpi(fkCliente)
    .then((resultado) => {
        res.json(resultado);
    })
    .catch((erro) => {
        console.log("Erro ao obter dados de alertas:", erro);
        res.status(500).json({ error: "Erro ao obter dados de alertas" });
    });
}
    
function trocarGraficoMensal(req, res){
    fkCliente = req.body.fkClienteServer;
    fkFilial = req.body.fkFilialServer;
    marcolinoModel.trocarGraficoMensal(fkCliente, fkFilial)
    .then((resultado) => {
        res.json(resultado);
    })
    .catch((erro) => {
        console.log("Erro ao obter dados de alertas:", erro);
        res.status(500).json({ error: "Erro ao obter dados de alertas" });
    });
}

module.exports = {
    plotarFilial,
    plotarMensal,
    plotarKpi,
    trocarGraficoMensal
}