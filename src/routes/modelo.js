var express = require("express");
var router = express.Router();

var modelosController = require("../Controller/modelosController");

router.get("/infoModelos/:fk", function(req, res){
    modelosController.listarMetricasEComponente(req, res)
})

router.get("/infoModelos/historico/:fk", function(req, res){
    modelosController.filtroHistoricoModelo(req, res)
})

module.exports = router;