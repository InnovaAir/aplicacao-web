var express = require('express');
var router = express.Router();

var dashDuduController = require('../Controller/dashDuduController');


router.get('/dash-dudu/:idUsuario', (req, res) => {
    dashDuduController.obterDesempenho(req, res);
});

router.get('/qtdMaqMenorDsmp/:idMaquina', (req, res) => {
    dashDuduController.qtdMaqMenorDsmp(req, res);
});

router.get('/getIdUsuario/:idUsuario', (req, res) => {
    dashDuduController.getIdUsuario(req, res);
});

router.get('/getIdUsuario/:idMaquina', (req, res) => {
    dashDuduController.getTotalMaq(req, res);
});


module.exports = router;
