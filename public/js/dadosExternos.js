require('dotenv').config();
const express = require('express');
const AWS = require('aws-sdk');
const csv = require('csvtojson');
const app = express();
const port = process.env.APP_PORT || 3000;

const s3 = new AWS.S3({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

app.get('/dashboard/dashLeticia', async (req, res) => {
  try {
    const data = await s3.getObject({
      Bucket: 'innovaair-dados',
      Key: 'relatorios/alertas_mensais.csv'
    }).promise();

    const json = await csv().fromString(data.Body.toString('utf-8'));
    res.json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao processar CSV' });
  }
});

app.listen(port, () => console.log(`✅ Servidor rodando em http://localhost:${port}`));
