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

function listarDesempenhoPorFilial(idUsuario) {
  var sql = `
    select * from dashRobertoDesempenho WHERE usuario = ${idUsuario};
  `;

  const params = [];

  return database.executar(sql, params);
}


function qtdMaqMenorDsmp(idFilial){
  console.log("cheguei na model")

  var sql = `
  SELECT COUNT(*) AS qtd_maquinas_abaixo_35 
FROM (
  SELECT
    m.idMaquina,
    (100 - COALESCE(SUM(CASE
      WHEN LOWER(ca.gravidade) = 'critico' THEN 2
      WHEN LOWER(ca.gravidade) = 'alto' THEN 1
      ELSE 0
    END), 0)) AS desempenho
  FROM maquina AS m
  LEFT JOIN componente c ON c.fkMaquina = m.idMaquina
  LEFT JOIN metrica mt ON mt.fkComponente = c.idComponente
  LEFT JOIN captura_alerta ca ON ca.fkMetrica = mt.idMetrica
  LEFT JOIN filial f ON m.fkFilial = f.idFilial
  WHERE ca.momento >= NOW() - INTERVAL 1 DAY
  ${idFilial ? `AND f.idFilial = ${idFilial}` : ''}
  GROUP BY m.idMaquina
) sub
WHERE desempenho < 35;
  `;
 
  return database.executar(sql);
}

function getIdUsuario(idUsuario){
  console.log("cheguei na model idUsuario")

  var sql = `
  SELECT * FROM usuario WHERE idUsuario = ${idUsuario}
  `;
  return database.executar(sql, [idUsuario]);

}

function getTotalMaq(idFilial){
  var sql = `
    SELECT COUNT(m.idMaquina) AS total_maquinas
    FROM maquina m
    LEFT JOIN filial f ON m.fkFilial = f.idFilial
    WHERE f.idFilial = ${idFilial}
  `;
  return database.executar(sql);
}

// function listarEnderecos() {
//   var sql = `
//     SELECT idEndereco, cep, logradouro, numero, complemento, bairro, cidade, estado
//     FROM endereco
//     ORDER BY cidade, bairro, logradouro;
//   `;

//   return database.executar(sql);
// }

// function listarFiliais(idEndereco) {
//   const sql = `
//     SELECT idFilial, terminal AS nomeFilial
//     FROM filial
//     WHERE fkEndereco = ?
//     ORDER BY terminal;
//   `;

//   return database.executar(sql, [idEndereco]);
// }


module.exports = {
  listarDesempenhoPorFilial,
  qtdMaqMenorDsmp,
  getTotalMaq,
  // listarEnderecos,
  // listarFiliais,
  getIdUsuario
};
