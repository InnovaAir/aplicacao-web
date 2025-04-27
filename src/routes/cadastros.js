var express = require("express");
var router = express.Router();

var cadastrosController = require("../Controller/cadastrosController");

// Gerenciamento de Métrica

router.get("/metricas/listar/filiais/:fk", function (req, res) {
    cadastrosController.listarFiliais(req, res)
});

router.get("/metricas/listar/totens/:fk", function (req, res) {
    cadastrosController.listarTotens(req, res)
})

router.get("/metricas/listar/componentes/:fk", function (req, res) {
    cadastrosController.listarComponentes(req, res)
})

router.get("/metricas/listar/:fk", function (req, res) {
    cadastrosController.listarMetricas(req, res)
})

router.get("/metricas/ver-unica/:fk", function (req, res) {
    cadastrosController.verMetrica(req, res)
})

router.post("/metricas/adicionar", function (req, res) {
    cadastrosController.adicionarMetrica(req, res)
})

router.put("/metricas/atualizar", function (req, res) {
    cadastrosController.atualizarMetrica(req, res)
})

router.delete("/metricas/deletar/:fk", function (req, res) {
    cadastrosController.deletarMetrica(req, res)
})

// Gerenciamento de Endereços

router.get("/enderecos/listar/:fk", function (req, res) {
    cadastrosController.listarEnderecos(req, res)
})

router.get("/enderecos/ver-unico/:fk", function (req, res) {
    cadastrosController.verEndereco(req, res)
})

router.put("/enderecos/atualizar", function (req, res) {
    cadastrosController.atualizarEndereco(req, res)
})

router.post("/enderecos/adicionar", function (req, res) {
    cadastrosController.adicionarEndereco(req, res)
})

router.delete("/enderecos/deletar/:fk", function (req, res) {
    cadastrosController.deletarEndereco(req, res)
})


module.exports = router;