var database = require("../database/config");

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

function getIntervaloPorPeriodo(periodo) {
  const hoje = new Date();
  let dataInicio, dataFim;

  switch (periodo) {
    case 'atual':
      dataInicio = new Date(hoje.setHours(0, 0, 0, 0));
      dataFim = new Date(hoje.setHours(24, 0, 0, 0));
      break;

    case 'ultimos_15_dias':
      dataInicio = new Date();
      dataInicio.setDate(hoje.getDate() - 15);
      dataInicio.setHours(0, 0, 0, 0);
      dataFim = new Date(dataInicio);
      dataFim.setDate(dataInicio.getDate() + 1);
      break;

    case 'um_mes_atras':
      dataInicio = new Date();
      dataInicio.setMonth(hoje.getMonth() - 1);
      dataInicio.setHours(0, 0, 0, 0);
      dataFim = new Date(dataInicio);
      dataFim.setDate(dataInicio.getDate() + 1);
      break;

    case 'tres_meses_atras':
      dataInicio = new Date();
      dataInicio.setMonth(hoje.getMonth() - 3);
      dataInicio.setHours(0, 0, 0, 0);
      dataFim = new Date(dataInicio);
      dataFim.setDate(dataInicio.getDate() + 1);
      break;

    default:
      dataInicio = new Date(hoje.setHours(0, 0, 0, 0));
      dataFim = new Date(hoje.setHours(24, 0, 0, 0));
  }

  const formatoSQL = (d) => d.toISOString().slice(0, 19).replace('T', ' ');

  return {
    dataInicio: formatoSQL(dataInicio),
    dataFim: formatoSQL(dataFim)
  };
}

const listarDesempenhoPorPeriodo = async (idUsuario, periodo) => {
  const { dataInicio, dataFim } = getIntervaloPorPeriodo(periodo);

  const sql = `
    SELECT
      m.hostname AS totem,
      f.terminal AS terminal,
      u.Idusuario as usuario,
      SUM(CASE WHEN ca.gravidade = 'critico' THEN 1 ELSE 0 END) AS critico,
      SUM(CASE WHEN ca.gravidade = 'alto' THEN 1 ELSE 0 END) AS alto,
      SUM(CASE WHEN ca.gravidade = 'baixo' THEN 1 ELSE 0 END) AS baixo,
      SUM(CASE WHEN ca.gravidade IN ('critico', 'alto', 'baixo') THEN 1 ELSE 0 END) AS total_alertas
    FROM maquina m
    JOIN filial f ON m.fkFilial = f.idFilial
    LEFT JOIN componente c ON c.fkMaquina = m.idMaquina
    LEFT JOIN metrica me ON me.fkComponente = c.idComponente
    JOIN usuarioFilial uf ON uf.fkFilial = f.idFilial
    JOIN usuario u ON uf.fkUsuario = u.idUsuario
    LEFT JOIN captura_alerta ca ON ca.fkMetrica = me.idMetrica
      AND ca.momento >= '${dataInicio}'
      AND ca.momento < '${dataFim}'
    WHERE u.Idusuario = ${idUsuario}
    GROUP BY totem, terminal, usuario;
  `;

  return database.executar(sql);
};

module.exports = {
  listarDesempenhoPorFilial,
  qtdMaqMenorDsmp,
  getTotalMaq,
  getIdUsuario,
  getIntervaloPorPeriodo,
  listarDesempenhoPorPeriodo
};