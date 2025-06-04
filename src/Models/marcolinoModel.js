var database = require("../database/config");

function plotarFilial(fkCliente){
    var instrucaoSql = `
                        select en.aeroporto as complemento, f.idFilial, f.terminal, COUNT(a.idCapturaAlerta) AS total_alertas
                        from captura_alerta a
                        join metrica me on a.fkMetrica = me.idMetrica
                        join componente c on me.fkComponente = c.idComponente
                        join maquina m on c.fkMaquina = m.idMaquina
                        join filial f on m.fkFilial = f.idFilial
                        join endereco en on f.fkEndereco = en.idEndereco
                        where f.fkcliente = ${fkCliente}
                        group by f.terminal, f.idFilial, en.bairro
                        order by total_alertas desc;
                        `;
    console.log("Executando instrução:", instrucaoSql);
    return database.executar(instrucaoSql);
}

function plotarMensal(fkCliente){
    var instrucaoSql = `
            select
            year(a.momento) as Ano,          -- Pega somente o ano da captura
            MONTH(a.momento) as Mes,         -- Pega somente o MÊS da captura
            c.componente as Componente,
            COUNT(*) as total_alertas    -- Total de alertas individualmente
            from captura_alerta a
            join metrica me on a.fkMetrica = me.idMetrica
            join componente c on me.fkComponente = c.idComponente
            join maquina m on c.fkMaquina = m.idMaquina
            join filial f on m.fkFilial = f.idFilial
            where f.fkcliente = ${fkCliente} -- condição para pegar os componentes de apenas um clienete
            group by
                YEAR(a.momento),  -- 2. AGRUPA os resultados: primeiro pelo ano
                MONTH(a.momento), -- Depois, dentro de cada ano, agrupa pelo mês
                c.componente      -- E dentro de cada mês, agrupa pelo nome do componente
            # (É por causa do GROUP BY que o "COUNT(*)" sabe o que contar separadamente)
            order by
            Ano asc,          -- 3. ORDENA os resultados: primeiro pelo Ano (ex: 2023, depois 2024)
            Mes asc,          -- Depois, ordena pelo Mês (ex: Janeiro, depois Fevereiro)
            case c.componente -- Define uma ORDEM PERSONALIZADA para os componentes dentro de cada mês
                when 'Processador' then 1   -- Processador será o primeiro
                when 'RAM' then 2   -- RAM será o segundo
                when 'Disco' then 3 -- Disco será o terceiro
                when 'REDE' then 4  -- REDE será o quarto
                else 5              -- Outros componentes (se houver) virão depois
            end asc;
    `;
    console.log("Executando instrução:", instrucaoSql);
    return database.executar(instrucaoSql);
}

function trocarGraficoMensal(fkCliente, fkFilial){
    var instrucaoSql = `
                        select
                            year(a.momento) as Ano,          -- Pega somente o ano da captura
                            MONTH(a.momento) as Mes,         -- Pega somente o MÊS da captura
                            c.componente as Componente,
                            COUNT(*) as total_alertas    -- Total de alertas individualmente
                        from captura_alerta a
                        join metrica me on a.fkMetrica = me.idMetrica
                        join componente c on me.fkComponente = c.idComponente
                        join maquina m on c.fkMaquina = m.idMaquina
                        join filial f on m.fkFilial = f.idFilial
                        where f.fkcliente = ${fkCliente} and f.idFilial = ${fkFilial} -- condição para pegar os componentes de apenas um clienete e uma filial
                        group by
                            YEAR(a.momento),  -- 2. AGRUPA os resultados: primeiro pelo ano
                            MONTH(a.momento), -- Depois, dentro de cada ano, agrupa pelo mês
                            c.componente      -- E dentro de cada mês, agrupa pelo nome do componente
                        # (É por causa do GROUP BY que o "COUNT(*)" sabe o que contar separadamente)
                        order by
                            Ano asc,          -- 3. ORDENA os resultados: primeiro pelo Ano (ex: 2023, depois 2024)
                            Mes asc,          -- Depois, ordena pelo Mês (ex: Janeiro, depois Fevereiro)
                            case c.componente -- Define uma ORDEM PERSONALIZADA para os componentes dentro de cada mês
                                when 'Processador' then 1   -- CPU será o primeiro
                                when 'RAM' then 2   -- RAM será o segundo
                                when 'Disco' then 3 -- Disco será o terceiro
                                when 'REDE' then 4  -- REDE será o quarto
                                else 5              -- Outros componentes (se houver) virão depois
                            end asc;
    `;
    console.log("Executando instrução:", instrucaoSql);
    return database.executar(instrucaoSql);
}

function plotarKpi(fkCliente){
    var instrucaoSql = `
                        select c.componente, COUNT(a.idCapturaAlerta) AS total_alertas
                        from captura_alerta a
                        join metrica me on a.fkMetrica = me.idMetrica
                        join componente c on me.fkComponente = c.idComponente
                        join maquina m on c.fkMaquina = m.idMaquina
                        join filial f on m.fkFilial = f.idFilial
                        where f.fkcliente = 2
                        group by c.componente
                        order by total_alertas desc;
    `;
    console.log("Executando instrução:", instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    plotarFilial,
    plotarMensal,
    plotarKpi,
    trocarGraficoMensal
}