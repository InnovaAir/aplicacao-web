var cadastrosModel = require("../Models/cadastrosModel");

function listarFiliais(req, res) {
    var fkCliente = req.params.fk;

    // Faça as validações dos valores    
    if (fkCliente == null) {
        res.status(400).send("ID do Cliente está nulo!");
    }

    cadastrosModel.listarFiliais(fkCliente)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((erro) => {
            console.log("Erro ao cadastrar:", erro);
            res.status(500).json({ error: "Erro ao cadastrar no banco de dados!" });
        });
}

function listarTotens(req, res) {
    var fkCliente = req.params.fk;

    // Faça as validações dos valores    
    if (fkCliente == null) {
        res.status(400).send("ID do Cliente está nulo!");
    }

    cadastrosModel.listarTotens(fkCliente)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((erro) => {
            console.log("Erro ao cadastrar:", erro);
            res.status(500).json({ error: "Erro ao cadastrar no banco de dados!" });
        });
}

function listarComponentes(req, res) {
    var fkMaquina = req.params.fk;

    // Faça as validações dos valores    
    if (fkMaquina == null) {
        res.status(400).send("ID da Máquina está nula!");
    }

    cadastrosModel.listarComponentes(fkMaquina)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((erro) => {
            console.log("Erro ao cadastrar:", erro);
            res.status(500).json({ error: "Erro ao cadastrar no banco de dados!" });
        });
}

function listarMetricas(req, res) {

    var fkComponente = req.params.fk;

    if (fkComponente == null) {
        res.status(400).send("ID do Componente está nulo!");
    }

    cadastrosModel.listarMetricas(fkComponente)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((erro) => {
            console.log("Erro ao cadastrar:", erro);
            res.status(500).json({ error: "Erro ao cadastrar no banco de dados!" });
        });
}

function verMetrica(req, res) {
    var idMetrica = req.params.fk;

    if (idMetrica == null) {
        res.status(400).send("ID da Métrica está nulo!");
    }

    cadastrosModel.verMetrica(idMetrica)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((erro) => {
            console.log("Erro ao cadastrar:", erro);
            res.status(500).json({ error: "Erro ao cadastrar no banco de dados!" });
        });
}


function adicionarMetrica(req, res) {
    var fkComponente = req.body.fk;
    var Metrica = req.body.metrica;
    var limiteMax = req.body.max;
    var limiteMin = req.body.min;

    if (fkComponente == null) {
        res.status(400).send("ID da Máquina está nula!");
    }

    if (limiteMax == ``) {
        limiteMax = null;
    }

    if (limiteMin == ``) {
        limiteMin = null;
    }

    cadastrosModel.adicionarMetrica(fkComponente, Metrica, limiteMax, limiteMin)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((erro) => {
            console.log("Erro ao cadastrar:", erro);
            res.status(500).json({ error: "Erro ao cadastrar no banco de dados!" });
        });
}

function atualizarMetrica(req, res) {
    var fkComponente = req.body.fk;
    var limiteMax = req.body.max;
    var limiteMin = req.body.min;

    if (fkComponente == null) {
        res.status(400).send("ID da Máquina está nula!");
    }

    if (limiteMax == ``) {
        limiteMax = null;
    }

    if (limiteMin == ``) {
        limiteMin = null;
    }

    cadastrosModel.atualizarMetrica(fkComponente, limiteMax, limiteMin)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((erro) => {
            console.log("Erro ao cadastrar:", erro);
            res.status(500).json({ error: "Erro ao cadastrar no banco de dados!" });
        });
}

function deletarMetrica(req, res) {
    var idMetrica = req.params.fk;

    if (idMetrica == null) {
        res.status(400).send("ID da Métrica está nulo!");
    }

    cadastrosModel.deletarMetrica(idMetrica)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((erro) => {
            console.log("Erro ao cadastrar:", erro);
            res.status(500).json({ error: "Erro ao cadastrar no banco de dados!" });
        });
}

function listarEnderecos(req, res) {

    var fkCliente = req.params.fk;

    if (fkCliente == null) {
        res.status(400).send("ID do Cliente está nulo!");
    }

    cadastrosModel.listarEnderecos(fkCliente)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((erro) => {
            console.log("Erro ao cadastrar:", erro);
            res.status(500).json({ error: "Erro ao cadastrar no banco de dados!" });
        });
}

function verEndereco(req, res) {
    var idEndereco = req.params.fk;

    if (idEndereco == null) {
        res.status(400).send("ID do Cliente está nulo!");
    }

    cadastrosModel.verEndereco(idEndereco)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((erro) => {
            console.log("Erro ao cadastrar:", erro);
            res.status(500).json({ error: "Erro ao cadastrar no banco de dados!" });
        });
}

function atualizarEndereco(req, res) {
    var idEndereco = req.body.fk;
    var cep = req.body.cep
    var logradouro = req.body.logradouro
    var numero = req.body.numero
    var complemento = req.body.complemento
    var bairro = req.body.bairro
    var cidade = req.body.cidade
    var estado = req.body.estado

    console.log(regiao)

    if (idEndereco == null) {
        res.status(400).send("ID do Endereço está nulo!");
    } else if (cep == null) {
        res.status(400).send("CEP do Endereço está nulo!");
    } else if (logradouro == null) {
        res.status(400).send("logradouro do Endereço está nulo!");
    } else if (numero == null) {
        res.status(400).send("numero do Endereço está nulo!");
    } else if (complemento == null) {
        res.status(400).send("complemento do Endereço está nulo!");
    } else if (bairro == null) {
        res.status(400).send("bairro do Endereço está nulo!");
    } else if (cidade == null) {
        res.status(400).send("cidade do Endereço está nulo!");
    } else if (estado == null) {
        res.status(400).send("estado do Endereço está nulo!");
    }

    cadastrosModel.atualizarEndereco(idEndereco, cep, logradouro, numero, complemento, bairro, cidade, estado)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((erro) => {
            console.log("Erro ao cadastrar:", erro);
            res.status(500).json({ error: "Erro ao cadastrar no banco de dados!" });
        });
}

function adicionarEndereco(req, res) {
    var cep = req.body.cep;
    var logradouro = req.body.logradouro;
    var numero = req.body.numero;
    var complemento = req.body.complemento;
    var bairro = req.body.bairro;
    var cidade = req.body.cidade;
    var estado = req.body.estado;

    if (cep == null) {
        res.status(400).send("CEP do Endereço está nulo!");
    } else if (logradouro == null) {
        res.status(400).send("logradouro do Endereço está nulo!");
    } else if (numero == null) {
        res.status(400).send("numero do Endereço está nulo!");
    } else if (complemento == null) {
        res.status(400).send("complemento do Endereço está nulo!");
    } else if (bairro == null) {
        res.status(400).send("bairro do Endereço está nulo!");
    } else if (cidade == null) {
        res.status(400).send("cidade do Endereço está nulo!");
    } else if (estado == null) {
        res.status(400).send("estado do Endereço está nulo!");
    }

    cadastrosModel.adicionarEndereco(cep, logradouro, numero, complemento, bairro, cidade, estado)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((erro) => {
            console.log("Erro ao cadastrar:", erro);
            res.status(500).json({ error: "Erro ao cadastrar no banco de dados!" });
        });
}

function deletarEndereco(req, res) {
    var idEndereco = req.params.fk;

    if (idEndereco == null) {
        res.status(400).send("ID do Endereco está nulo!");
    }

    cadastrosModel.deletarEndereco(idEndereco)
        .then((resultado) => {
            res.json(resultado);
        })
        .catch((erro) => {
            console.log("Erro ao cadastrar:", erro);
            res.status(500).json({ error: "Erro ao cadastrar no banco de dados!" });
        });
}

module.exports = {
    // Get
    listarFiliais,
    listarTotens,
    listarComponentes,
    listarMetricas,
    verMetrica,
    listarEnderecos,
    verEndereco,
    // Post
    adicionarMetrica,
    adicionarEndereco,
    // Put
    atualizarMetrica,
    atualizarEndereco,
    // Delete
    deletarMetrica,
    deletarEndereco,
}

