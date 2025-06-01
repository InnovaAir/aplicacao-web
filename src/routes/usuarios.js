var express = require("express");
var router = express.Router();

var usuarioController = require("../Controller/usuariosController");

router.get("/enderecos/:idUsuario", (req, res) => {
    usuarioController.identificarEnderecos(req, res);
})

router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
})

router.post("/cadastrarFuncionario", function (req, res) {
    usuarioController.cadastrarFuncionario(req, res);
})

router.post("/entrar", function (req, res){
    usuarioController.entrar(req,res);
})

router.post("/listarCargo", function (req, res){
    usuarioController.listarCargo(req,res);
})

router.post("/listarFiliais", function (req, res){
    usuarioController.listarFiliais(req,res);
})

module.exports = router;