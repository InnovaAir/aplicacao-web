var express = require("express");
var router = express.Router();

var dashboardsController = require("../Controller/dashboardsController");

router.post("/dashboards/dashGerenteDados", function(req, res) {
    dashboardsController.dashGerenteDados(req, res)
})

module.exports = router;