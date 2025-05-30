var express = require("express");
var router = express.Router();

var dashboardsController = require("../Controller/dashboardsController");

router.post("/plotarFilial", function(req, res) {
    mercolinoController.plotarFilial(req, res)
})


module.exports = router;