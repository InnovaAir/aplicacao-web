var express = require("express");
var router = express.Router();

var avisoController = require("../Controller/controllerLeticia");

router.get("/getAlertas", function (req, res) {
    avisoController.getAlertas(req, res);
});

module.exports = router;