var database = require("../database/config");

function listarDesempenhoPorFilial(idUsuario, periodos) {
  var sql = `
    select * from dashRobertoDesempenho WHERE usuario = ${idUsuario} AND momento >= NOW() - INTERVAL ${periodos} DAY;
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

module.exports = {
  listarDesempenhoPorFilial,
  qtdMaqMenorDsmp,
  getTotalMaq,
  getIdUsuario
};