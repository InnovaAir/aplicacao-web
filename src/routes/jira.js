var express = require('express');
var router = express.Router();

var jiraController = require("../Controller/jiraController")

router.post("/buscarChamados", (req, res) => {
    jiraController.buscarChamados(req, res)
});

module.exports = router