var modelFeitosa = require("../Models/feitosaModel")

var dadosMaquinas = [];

function getArrayData(req, res) {
    res.status(200).send(dadosMaquinas);
}

function plotarEnderecos() {
    modelFeitosa.getTodosEnderecos().then((idEnderecos) => {
        dadosMaquinas = idEnderecos;

        dadosMaquinas.forEach(endereco => {
            endereco.totens = [];
        });
    })

    modelFeitosa.listarTotens().then((totensBanco) => {
        for (let i = 0; i < dadosMaquinas.length; i++) {
            const endereco = dadosMaquinas[i];
            const idEnderecoExistente = dadosMaquinas[i].idEndereco;

            totensBanco.forEach(totem => {
                totem.totem.dados = { cpu: [], ram: [], disco: [], rede: [] }

                if (totem.idEndereco == idEnderecoExistente) {
                    endereco.totens.push(totem.totem)
                }
            });
        }

    })

}

plotarEnderecos()

function inserirMaquina(req, res) {
    var totemEnviado = req.body

    console.log(totemEnviado)

    if (totemEnviado.placa_mae == null) {
        res.status(400).send("Sem Placa-Mãe")
    } else if (dadosMaquinas.length == 0) {
        res.status(400).send("Array de Dados não há os endereços cadastrados")
    }

    var endereco_totem;
    var id_totem;

    modelFeitosa.getMaquina(totemEnviado.placa_mae)
        .then((querry) => {
            endereco_totem = querry[0].idEndereco;
            id_totem = querry[0].idMaquina;

            dadosMaquinas.forEach(endereco => {
                if (endereco.idEndereco == endereco_totem) {
                    endereco.totens.forEach(totemAtual => {
                        if (totemAtual.numeroSerial == totemEnviado.placa_mae) {

                            var dados = totemAtual.dados;

                            console.log(dados.length)

                            totemAtual.ip = totemEnviado.ip;
                            totemAtual.momento = totemEnviado.momento.split(".")[0];

                            if (dados.cpu.length < 8) {
                                // Inserir dados
                                dados.cpu.push(totemEnviado.dados.cpu[0])
                                dados.ram.push(totemEnviado.dados.ram[0])
                                dados.disco.push(totemEnviado.dados.disco[0])
                                dados.rede.push(totemEnviado.dados.rede[0])
                            }
                            else {
                                // Há muito dados (Apaga o menos atualizado e insere o dado mais atualizado)
                                dados.cpu.splice(0, 1)
                                dados.ram.splice(0, 1)
                                dados.disco.splice(0, 1)
                                dados.rede.splice(0, 1)

                                dados.cpu.push(totemEnviado.dados.cpu[0])
                                dados.ram.push(totemEnviado.dados.ram[0])
                                dados.disco.push(totemEnviado.dados.disco[0])
                                dados.rede.push(totemEnviado.dados.rede[0])
                            }
                            res.status(200).send("SUCESSO")
                        }
                    });
                }
            });

        });
}

module.exports = {
    plotarEnderecos,
    inserirMaquina,
    getArrayData,
}