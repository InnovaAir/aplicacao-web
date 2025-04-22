var express = require("express");
var router = express.Router();

var usuarioController = require("../Controller/usuariosController");

router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.post("/entrar", function (req, res){
    usuarioController.entrar(req,res);
})

module.exports = router;