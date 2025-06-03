var database = require("../database/config");

function listarTotens() {
    sql = `SELECT * FROM obter_enderecos_usuario;`

    return database.executar(sql);
}

function getMaquina(placaMae) {
    var sql = `
    SELECT e.idEndereco, m.idMaquina 
	FROM maquina as m
    JOIN filial as f
    ON m.fkFilial = f.idFilial
    JOIN endereco as e
    ON f.fkEndereco = e.idEndereco
    WHERE m.numeroSerial = '${placaMae}';
    `

    return database.executar(sql);
}

function getAlertas(idMaquina) {
    sql = `
        SELECT count(idCapturaAlerta) AS total
            FROM captura_alerta as c
            JOIN metrica as m
            ON	c.fkMetrica = m.idMetrica
            JOIN componente as comp
            ON m.fkComponente = comp.idComponente
            JOIN maquina as maq
            ON comp.fkMaquina = maq.idMaquina
            WHERE DAY(momento) = DAY(CURRENT_TIMESTAMP()) AND maq.idMaquina = ${idMaquina};
        `
    console.log(sql)
    return database.executar(sql)
}

function getTodosEnderecos() {
    var sql = `
    SELECT idEndereco 
    FROM endereco;
    `

    return database.executar(sql)
}

function getEnderecos(idMaquina) {
    var sql = `SELECT e.idEndereco 
                FROM endereco as e         
                JOIN filial as fil 
                ON fil.fkEndereco = e.idEndereco 
                JOIN maquina as maq 
                ON maq.fkFilial = fil.idFilial
                WHERE maq.idMaquina = ${idMaquina};`

    return database.executar(sql)
}

async function getIDComponente(idMaquina) {

    var sqlCPU = `
        SELECT m.idMetrica, c.Componente, m.limiteMaximo, m.limiteMinimo, c.Componente, maq.idMaquina, m.Metrica
            FROM metrica as m 
            JOIN componente as c
            ON m.fkComponente = c.idComponente
            JOIN maquina as maq
            ON c.fkMaquina = maq.idMaquina;
        `
    var sqlRAM = `
        SELECT m.idMetrica, c.Componente, m.limiteMaximo, m.limiteMinimo
            FROM metrica as m 
            JOIN componente as c
            ON m.fkComponente = c.idComponente
            JOIN maquina as maq
            ON c.fkMaquina = maq.idMaquina
            WHERE m.metrica = 'porcentagemUso' AND c.Componente = "RAM" AND maq.idMaquina = ${idMaquina};
        `
    var sqlDISCO = `
        SELECT m.idMetrica, c.Componente, m.limiteMaximo, m.limiteMinimo
            FROM metrica as m 
            JOIN componente as c
            ON m.fkComponente = c.idComponente
            JOIN maquina as maq
            ON c.fkMaquina = maq.idMaquina
            WHERE m.metrica = 'porcentagemUso' AND c.Componente = "Armazenamento" AND maq.idMaquina = ${idMaquina};
        `
    var sqlREDE = `
        SELECT m.idMetrica, c.Componente, m.limiteMaximo, m.limiteMinimo
            FROM metrica as m 
            JOIN componente as c
            ON m.fkComponente = c.idComponente
            JOIN maquina as maq
            ON c.fkMaquina = maq.idMaquina
            WHERE m.metrica = 'velocidadeDownload' AND c.Componente = "Rede" AND maq.idMaquina = ${idMaquina};
        `

    const idCPU = await database.executar(sqlCPU);
    const idRAM = await database.executar(sqlRAM);
    const idDISCO = await database.executar(sqlDISCO);
    const idREDE = await database.executar(sqlREDE);

    return [idCPU, idRAM, idDISCO, idREDE];
}

function log_alerta_hoje(idMaquina) {
    var sql = `
    SELECT gravidade,
	momento,	
	CASE 
		WHEN hour(momento) BETWEEN 0 AND 5 THEN "Madrugada"
		WHEN hour(momento) BETWEEN 6 AND 11 THEN "Manhã"
		WHEN hour(momento) BETWEEN 12 AND 17 THEN "Tarde"
		WHEN hour(momento) BETWEEN 18 AND 23 THEN "Noite"
	END as periodo,
    c.componente
	FROM maquina as maq
    JOIN componente as c
    ON c.fkMaquina = maq.idMaquina
    JOIN metrica as m
    ON m.fkComponente = c.idComponente
    JOIN captura_alerta cap
    ON cap.fkMetrica = m.idMetrica
    WHERE idMaquina = ${idMaquina}
    ORDER BY momento desc
    LIMIT 10;
    `

    return database.executar(sql)
}

module.exports = {
    listarTotens,
    getMaquina,
    getAlertas,
    getTodosEnderecos,
    getEnderecos,
    getIDComponente,
    log_alerta_hoje,
}