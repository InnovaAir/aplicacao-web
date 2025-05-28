var express = require('express');
var router = express.Router();

var dashDuduController = require('../Controller/dashDuduController');


router.get('/dash-dudu', (req, res) => {
    dashDuduController.obterDesempenho(req, res);
});


module.exports = router;
