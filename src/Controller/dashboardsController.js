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

module.exports = {
dashGerenteDados
}
