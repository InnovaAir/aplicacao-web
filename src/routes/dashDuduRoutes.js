var express = require('express');
var router = express.Router();

var dashDuduController = require('../Controller/dashDuduController');
var dashDuduModel = require('../Models/dashDuduModel')

router.get('/dash-dudu', (req, res) => {
    dashDuduController.listarDesempenho(req, res);
});


module.exports = router;
