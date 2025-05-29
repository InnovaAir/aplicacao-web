var express = require("express");
var router = express.Router();

var dashboardsController = require("../Controller/dashboardsController");

router.post("/dashGerenteDados", function(req, res) {
    dashboardsController.dashGerenteDados(req, res)
})

router.post("/dashGerenteDadosQtd", function(req, res) {
    dashboardsController.dashGerenteDadosQtd(req, res)
})

module.exports = router;