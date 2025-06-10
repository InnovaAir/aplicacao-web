var express = require("express");
var router = express.Router();
const AWS = require('aws-sdk');

var avisoController = require("../Controller/controllerLeticia");

require("dotenv").config({ path: '.env.dev' });

router.get("/getAlertas", function (req, res) {
    avisoController.getAlertas(req, res);
});

router.get("/getAlertasNivel", function (req, res) {
    avisoController.getAlertasNivel(req, res);
});

router.get("/getEndereco", function (req, res) {
    avisoController.getEndereco(req, res);
});

const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const csv = require("csvtojson");

const s3 = new S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});

async function streamToString(stream) {
    const chunks = [];
    for await (const chunk of stream) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf-8');
}

router.get('/getCsvAndConvertToJson', async (req, res) => {
    try {
        console.log("AWS_ACCESS_KEY_ID:", process.env.AWS_ACCESS_KEY_ID);
        console.log("AWS_SECRET_ACCESS_KEY:", process.env.AWS_SECRET_ACCESS_KEY ? "DEFINED" : "UNDEFINED");
        console.log("AWS_SESSION_TOKEN:", process.env.AWS_SESSION_TOKEN ? "DEFINED" : "UNDEFINED");
        const command = new GetObjectCommand({
            Bucket: 'innovaair-raw',
            Key: 'clima/clima_2025-06-10.csv'
        });

        const data = await s3.send(command);
        const csvString = await streamToString(data.Body);
        const json = await csv().fromString(csvString);

        res.json(json);
    } catch (err) {
        console.error("Erro ao processar CSV:", err);
        res.status(500).json({ error: "Erro ao processar CSV" });
    }
});

module.exports = router;