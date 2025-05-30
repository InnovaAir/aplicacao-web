var dashboardsModel = require("../Models/dashboardsModel");

function dashGerenteDados(req, res){
    idUsuario = req.body.idUsuarioServer;

    dashboardsModel.dashGerenteDados(idUsuario)
            .then((resultado) => {
                res.json(resultado);
            })
            .catch((erro) => {
                console.log("Erro ao obter dados do gerente:", erro);
                res.status(500).json({ error: "Erro ao obter dados do gerente" });
            });
}

function dashGerenteDadosQtd(req, res){
    modelo1 = req.body.modelo1Server;
    modelo5 = req.body.modelo5Server;
    idUsuario = req.body.idUsuarioServer;
    dashboardsModel.dashGerenteDadosQtd(modelo1, modelo2, modelo3, modelo4, modelo5, idUsuario)
            .then((resultado) => {
                res.json(resultado);
            })
            .catch((erro) => {
                console.log("Erro ao obter dados do gerente:", erro);
                res.status(500).json({ error: "Erro ao obter dados do gerente" });
            });
}

module.exports = {
dashGerenteDados,
dashGerenteDadosQtd
}