var express = require("express");
var router = express.Router();

var modelosController = require("../Controller/modelosController");

router.get("/infoModelos/:fk", function(req, res){
    modelosController.listarMetricasEComponente(req, res)
})

module.exports = router;