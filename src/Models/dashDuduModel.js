var database = require("../database/config");

// var listarDesempenhoPorFilial = async (idFilial = 1) => {
//   var sql = `
//     SELECT
//         m.hostname AS nomeTotem,
//         f.setor,
//         SUM(CASE WHEN ca.gravidade = 'critico' THEN 1 ELSE 0 END) AS critico,
//         SUM(CASE WHEN ca.gravidade = 'alto' THEN 1 ELSE 0 END) AS alto,
//         SUM(CASE WHEN ca.gravidade = 'baixo' THEN 1 ELSE 0 END) AS baixo,
//         SUM(CASE WHEN ca.gravidade IN ('critico', 'alto', 'baixo') THEN 1 ELSE 0 END) AS totalAlertas
//     FROM captura_alerta ca
//     JOIN metrica me ON ca.fkMetrica = me.idMetrica
//     JOIN componente c ON me.fkComponente = c.idComponente
//     JOIN maquina m ON c.fkMaquina = m.idMaquina
//     JOIN filial f ON m.fkFilial = f.idFilial
//     WHERE m.fkFilial = 1
//       AND ca.momento >= NOW() - INTERVAL 1 DAY
//     GROUP BY m.hostname, f.setor;
//   `;
  
//   return database.executar(sql);
// };

function listarDesempenhoPorFilial(idFilial){
  var sql = `
    SELECT
        m.hostname AS totem,
        f.setor as filial,
        SUM(CASE WHEN ca.gravidade = 'critico' THEN 1 ELSE 0 END) AS critico,
        SUM(CASE WHEN ca.gravidade = 'alto' THEN 1 ELSE 0 END) AS alto,
        SUM(CASE WHEN ca.gravidade = 'baixo' THEN 1 ELSE 0 END) AS baixo,
        SUM(CASE WHEN ca.gravidade IN ('critico', 'alto', 'baixo') THEN 1 ELSE 0 END) AS total_alertas
    FROM captura_alerta ca
    JOIN metrica me ON ca.fkMetrica = me.idMetrica
    JOIN componente c ON me.fkComponente = c.idComponente
    JOIN maquina m ON c.fkMaquina = m.idMaquina
    JOIN filial f ON m.fkFilial = f.idFilial
    WHERE ca.momento >= NOW() - INTERVAL 1 DAY
    ${idFilial ? `AND m.fkFilial = ${idFilial}` : ''}
    GROUP BY m.hostname, f.setor
  `;

  return database.executar(sql);
};

// function qtdMaqMenorDsmp(idMaquina){
//   console.log("cheguei na model")


//   var sql = `
//     SELECT * FROM Maquina WHERE idMaquina = ${idMaquina}
//   `;
 
//   return database.executar(sql);
// }

function getIdUsuario(idUsuario){
  console.log("cheguei na model idUsuario")

  var sql = `
    SELECT * FROM Usuario WHERE idUsuario = ${idUsuario};
  `;

  return database.executar(sql)
}

// function getTotalMaq(idMaquina){
//   console.log("cheguei na model do getTotalMaq")

//   var slq = `
//     SELECT COUNT(idMaquina) FROM maquina;
//   `;

//   return database.executar(sql)
// }

module.exports = {
  listarDesempenhoPorFilial,
  getIdUsuario,
};
