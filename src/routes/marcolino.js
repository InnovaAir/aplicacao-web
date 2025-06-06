var express = require("express");
var router = express.Router();

var marcolinoController = require("../Controller/marcolinoController");

router.post("/plotarFilial", function(req, res) {
    marcolinoController.plotarFilial(req, res)
});

router.post("/plotarMensal", function(req, res) {
    marcolinoController.plotarMensal(req, res)
});

router.post("/plotarKpi", function(req, res) {
    marcolinoController.plotarKpi(req, res)
});

router.post("/trocarKpi", function(req, res) {
    marcolinoController.trocarKpi(req, res)
});

router.post("/trocarGraficoMensal", function(req, res) {
    marcolinoController.trocarGraficoMensal(req, res)
});


module.exports = router;