var avisoModel = require("../Models/modelLeticia");
const csv = require('csvtojson');

function getAlertas(req, res) {
    avisoModel.getAlertas()
        .then((resultado) => {
            res.json(resultado);
        }).catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar os avisos: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function getAlertasNivel(req, res) {
    avisoModel.getAlertasNivel()
        .then((resultado) => {
            res.json(resultado);
        }).catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar os avisos: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

function getEndereco(req, res) {
    avisoModel.getEndereco()
        .then((resultado) => {
            res.json(resultado);
        }).catch(function (erro) {
            console.log(erro);
            console.log("Houve um erro ao buscar os avisos: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}

async function getCsvAndConvertToJson(bucketName, fileKey) {
    try {
        const data = await s3.getObject({
            Bucket: bucketName,
            Key: fileKey
        }).promise();

        const csvContent = data.Body.toString('utf-8');
        const jsonArray = await csv().fromString(csvContent);

        console.log(jsonArray);
        return jsonArray;

    } catch (error) {
        console.error('Erro ao processar CSV do S3:', error);
    }
}

module.exports = {
    getAlertas,
    getAlertasNivel,
    getEndereco,
    getCsvAndConvertToJson
}