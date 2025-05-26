var express = require("express");
var router = express.Router();

var controllerFeitosa = require("../Controller/feitosaController")
var modelFeitosa = require("../Models/feitosaModel")

router.get("/totalAlertas/today/:idMaquina", (req, res) => {
    controllerFeitosa.getAlertas(req, res)
})

router.get("/enderecos", (req, res) => {
    controllerFeitosa.getEnderecos
})

var dadosMaquinas = [];
router.post("/tempoReal", async (req, res) => {
    var totem = req.body

    if (totem.dados == null) {
        res.status(400).send("Dados vazio")
    } else if (totem.placa_mae == null) {
        res.status(400).send("PlacaMae vazio")
    }

    if (dadosMaquinas.length == 0) {
        // Caso não tiver máquinas, adicione
        try {
            const answer = await modelFeitosa.getID(totem.placa_mae);

            if (answer == null) {
                return "Máquina não cadastrada"
            }
            totem.id_maquina = answer[0].idMaquina;
            dadosMaquinas.push(totem)

        } catch (error) {
            console.log(error)
        }
    } else {
        // Caso tiver máquinas
        var hasTotem = false;

        // Verifica se a máquina já existe no Array
        for (let i = 0; i < dadosMaquinas.length; i++) {
            const totemAtual = dadosMaquinas[i];

            // Apenas atualiza os dados 
            if (totemAtual.placa_mae == totem.placa_mae) {
                totemAtual.processos = totem.processos
                totemAtual.momento = totem.momento

                // Boolean de confirmação que o totem que enviou os dados já existe na memoria
                hasTotem = true

                // Adiciona os dados recebidos ou atualiza os que já tem
                if (totemAtual.dados.cpu.length < 8) {
                    totemAtual.dados.cpu.push(totem.dados.cpu[0])
                    totemAtual.dados.ram.push(totem.dados.ram[0])
                    totemAtual.dados.disco.push(totem.dados.disco[0])
                    totemAtual.dados.rede.push(totem.dados.rede[0])
                } else {
                    totemAtual.dados.cpu.splice(0, 1)
                    totemAtual.dados.ram.splice(0, 1)
                    totemAtual.dados.disco.splice(0, 1)
                    totemAtual.dados.rede.splice(0, 1)

                    totemAtual.dados.cpu.push(totem.dados.cpu[0])
                    totemAtual.dados.ram.push(totem.dados.ram[0])
                    totemAtual.dados.disco.push(totem.dados.disco[0])
                    totemAtual.dados.rede.push(totem.dados.rede[0])
                }
            }
        }

        if (!hasTotem) {
            // Buscar o ID da Máquina e seu ID de Enderçeo
            try {
                const answer = await modelFeitosa.getID(totem.placa_mae);

                if (answer == null) {
                    return "Máquina não cadastrada"
                }
                totem.id_maquina = answer[0].idMaquina;
                dadosMaquinas.push(totem)
            } catch (error) {
                console.log(error)
            }
        }
    }
    res.status(400).send("Maquina Inserida/Atualizada")
});

router.get("/array", (req, res) => {
    res.json(dadosMaquinas)
})

module.exports = router;