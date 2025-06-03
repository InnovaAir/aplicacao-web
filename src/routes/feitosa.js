var express = require("express");
var router = express.Router();

var controllerFeitosa = require("../Controller/feitosaController")
var dataController = require("../Controller/routesDataController");
const { route } = require(".");

router.get("/totalAlertas/today/:idMaquina", (req, res) => {
    controllerFeitosa.getAlertas(req, res)
})

router.get("/enderecos/:idMaquina", (req, res) => {
    controllerFeitosa.getEnderecos(req, res)
})

router.get("/totem/:idMaquina", (req, res) => {
    controllerFeitosa.getIDComponentes(req, res)
})

router.get("/totensCadastrados", (req, res) => {
    controllerFeitosa.obterMaquinasDoEnderecos(req, res)
})

router.get("/log_alertas/:idMaquina", (req, res) => {
    controllerFeitosa.log_alerta(req, res)
})

router.post("/enviarDados", async (req, res) => {
    dataController.inserirMaquina(req, res)
});

router.get("/array", (req, res) => {
    dataController.getArrayData(req, res)
})


module.exports = router;