var database = require("../database/config");

function getAlertas(idMaquina, dia) {
    var sql = ``

    if (dia == true) {
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
    } else {
        sql = `
        SELECT count(idCapturaAlerta) AS total 
            FROM captura_alerta as c
            JOIN metrica as m
            ON	c.fkMetrica = m.idMetrica
            JOIN componente as comp
            ON m.fkComponente = comp.idComponente
            JOIN maquina as maq
            ON comp.fkMaquina = maq.idMaquina
            WHERE DAY(momento) = DAY(${dia}) AND maq.idMaquina = ${idMaquina};
        `
    }
    return database.executar(sql)
}

function getEnderecos() {
    var sql = `SELECT * FROM endereco;`
}

function getID(placaMae) {    
    var sql = `SELECT idMaquina FROM maquina WHERE numeroSerial = '${placaMae}';`
    return database.executar(sql)
}



module.exports = {
    getAlertas,
    getID
}