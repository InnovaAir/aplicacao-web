var express = require("express");
var router = express.Router();

var dashboardsController = require("../Controller/dashboardsController");

router.post("/dashGerenteDados", function(req, res) {
    dashboardsController.dashGerenteDados(req, res)
})

router.post("/dashGerenteDadosQtd", function(req, res) {
    dashboardsController.dashGerenteDadosQtd(req, res)
})

router.get("/obterDadosGerenteMenor/:idUsuario", function(req, res) {
    dashboardsController.obterDadosGerenteMenor(req, res)
})

module.exports = router;