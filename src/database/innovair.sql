create database innovair;
use innovair;

CREATE TABLE IF NOT EXISTS `innovair`.`Cliente` (
  `idCliente` INT NOT NULL AUTO_INCREMENT,
  `razaoSocial` VARCHAR(105) NULL,
  `CNPJ` CHAR(14) NULL,
  `email` VARCHAR(255) NULL,
  `telefone` VARCHAR(11) NULL,
  `resposanvel` VARCHAR(50) NULL,
  PRIMARY KEY (`idCliente`));

  CREATE TABLE IF NOT EXISTS `innovair`.`Usuario` (
  `idUsuario` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NULL,
  `tipoUsuario` TINYINT NULL,
  `email` VARCHAR(255) NULL,
  `senha` VARCHAR(30) NULL,
  `fkCliente` INT NOT NULL,
  PRIMARY KEY (`idUsuario`),
  INDEX `fk_Usuario_Cliente_idx` (`fkCliente` ASC) VISIBLE,
  CONSTRAINT `fk_Usuario_Cliente`
    FOREIGN KEY (`fkCliente`)
    REFERENCES `innovair`.`Cliente` (`idCliente`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

    CREATE TABLE IF NOT EXISTS `innovair`.`Filial` (
  `idFilial` INT NOT NULL AUTO_INCREMENT,
  `aeroporto` VARCHAR(50) NULL,
  `terminal` VARCHAR(30) NULL,
  `setor` VARCHAR(30) NULL,
  `fkCliente` INT NOT NULL,
  PRIMARY KEY (`idFilial`),
  INDEX `fk_Filial_Cliente1_idx` (`fkCliente` ASC) VISIBLE,
  CONSTRAINT `fk_Filial_Cliente1`
    FOREIGN KEY (`fkCliente`)
    REFERENCES `innovair`.`Cliente` (`idCliente`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

CREATE TABLE IF NOT EXISTS `innovair`.`Computador` (
  `idComputador` INT NOT NULL AUTO_INCREMENT,
  `apelido` VARCHAR(100) NULL,
  `numeroSeriePlacaMae` VARCHAR(100) NULL,
  `sistemaOperacional` VARCHAR(100) NULL,
  `hostname` VARCHAR(100) NULL,
  `arquitetura` VARCHAR(100) NULL,
  `fkFilial` INT NOT NULL,
  PRIMARY KEY (`idComputador`),
  INDEX `fk_Maquina_Filial1_idx` (`fkFilial` ASC) VISIBLE,
  CONSTRAINT `fk_Maquina_Filial1`
    FOREIGN KEY (`fkFilial`)
    REFERENCES `innovair`.`Filial` (`idFilial`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

    CREATE TABLE IF NOT EXISTS `innovair`.`CPU` (
  `idCpu` INT NOT NULL AUTO_INCREMENT,
  `modelo` VARCHAR(45) NULL,
  `frequencia` DOUBLE NULL,
  `cores` INT NULL,
  `fkComputador` INT NOT NULL,
  PRIMARY KEY (`idCpu`, `fkComputador`),
  INDEX `fk_CPU_Computador1_idx` (`fkComputador` ASC) VISIBLE,
  CONSTRAINT `fk_CPU_Computador1`
    FOREIGN KEY (`fkComputador`)
    REFERENCES `innovair`.`Computador` (`idComputador`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

CREATE TABLE IF NOT EXISTS `innovair`.`Disco` (
  `idDisco` INT NOT NULL AUTO_INCREMENT,
  `tipo` CHAR(3) NULL,
  `capacidade` DOUBLE NULL,
  `montagem` VARCHAR(45) NULL,
  `sistemaArquivos` VARCHAR(45) NULL,
  `fkComputador` INT NOT NULL,
  PRIMARY KEY (`idDisco`, `fkComputador`),
  INDEX `fk_Disco_Computador1_idx` (`fkComputador` ASC) VISIBLE,
  CONSTRAINT `fk_Disco_Computador1`
    FOREIGN KEY (`fkComputador`)
    REFERENCES `innovair`.`Computador` (`idComputador`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


CREATE TABLE IF NOT EXISTS `innovair`.`Memoria` (
  `idMemoria` INT NOT NULL AUTO_INCREMENT,
  `tamanho` DOUBLE NULL,
  `fkComputador` INT NOT NULL,
  PRIMARY KEY (`idMemoria`, `fkComputador`),
  INDEX `fk_Memoria_Computador1_idx` (`fkComputador` ASC) INVISIBLE,
  CONSTRAINT `fk_Memoria_Computador1`
    FOREIGN KEY (`fkComputador`)
    REFERENCES `innovair`.`Computador` (`idComputador`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

CREATE TABLE IF NOT EXISTS `innovair`.`MetricaMemoria` (
  `idMetricaMemoria` INT NOT NULL AUTO_INCREMENT,
  `dataHora` TIMESTAMP NULL DEFAULT current_timestamp,
  `percentualUso` DOUBLE NULL,
  `quantidadeLivre` DOUBLE NULL,
  `quantidadeUsada` DOUBLE NULL,
  `fkMemoria` INT NOT NULL,
  PRIMARY KEY (`idMetricaMemoria`, `fkMemoria`),
  INDEX `fk_MetricaMemoria_Memoria1_idx` (`fkMemoria` ASC) VISIBLE,
  CONSTRAINT `fk_MetricaMemoria_Memoria1`
    FOREIGN KEY (`fkMemoria`)
    REFERENCES `innovair`.`Memoria` (`idMemoria`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

select dataHora, percentualUso from MetricaCPU;
select dataHora, percentualUso from MetricaCPU order by datahora desc limit 1;
CREATE TABLE IF NOT EXISTS `innovair`.`MetricaCPU` (
  `idMetricaCPU` INT NOT NULL AUTO_INCREMENT,
  `dataHora` TIMESTAMP NULL DEFAULT current_timestamp,
  `percentualUso` DOUBLE NULL,
  `fkCpu` INT NOT NULL,
  PRIMARY KEY (`idMetricaCPU`, `fkCpu`),
  INDEX `fk_MetricaCPU_CPU1_idx` (`fkCpu` ASC) VISIBLE,
  CONSTRAINT `fk_MetricaCPU_CPU1`
    FOREIGN KEY (`fkCpu`)
    REFERENCES `innovair`.`CPU` (`idCpu`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);
    
CREATE TABLE IF NOT EXISTS `innovair`.`MetricaDisco` (
  `idMetricaDisco` INT NOT NULL AUTO_INCREMENT,
  `dataHora` TIMESTAMP NULL DEFAULT current_timestamp,
  `percentualUso` DOUBLE NULL,
  `quantidadeLivre` DOUBLE NULL,
  `quantidadeUsada` DOUBLE NULL,
  `fkDisco` INT NOT NULL,
  PRIMARY KEY (`idMetricaDisco`, `fkDisco`),
  INDEX `fk_MetricaDisco_Disco1_idx` (`fkDisco` ASC) VISIBLE,
  CONSTRAINT `fk_MetricaDisco_Disco1`
    FOREIGN KEY (`fkDisco`)
    REFERENCES `innovair`.`Disco` (`idDisco`)
    ON DELETE CASCADE
    ON UPDATE CASCADE);


INSERT INTO `innovair`.`Cliente` (`razaoSocial`, `CNPJ`, `email`, `telefone`, `resposanvel`)
VALUES
('InovAir Soluções em TI', '12345678000199', 'contato@inovair.com', '11987654321', 'João Silva'),
('AeroTech Consultoria', '98765432000111', 'contato@aerotech.com', '21987654321', 'Maria Oliveira'),
('CloudNova Serviços', '45678912000122', 'contato@cloudnova.com', '31987654321', 'Carlos Souza');

INSERT INTO `innovair`.`Usuario` (`nome`, `tipoUsuario`, `email`, `senha`, `fkCliente`)
VALUES
('Ana Costa', 1, 'ana.costa@inovair.com', 'senha123', 1),
('Pedro Alves', 2, 'pedro.alves@aerotech.com', 'senha456', 2),
('Luiza Fernandes', 1, 'luiza.fernandes@cloudnova.com', 'senha789', 3);

INSERT INTO `innovair`.`Filial` (`aeroporto`, `terminal`, `setor`, `fkCliente`)
VALUES
('Aeroporto de Guarulhos', 'Terminal 1', 'Setor A', 1),
('Aeroporto Santos Dumont', 'Terminal 2', 'Setor B', 2),
('Aeroporto de Confins', 'Terminal 1', 'Setor C', 3);



-- Inserindo dados fictícios na tabela MetricaCPU
INSERT INTO `innovair`.`MetricaCPU` (`percentualUso`, `fkCpu`)
VALUES
(45.2, 1),
(50.8, 1),
(38.5, 1),
(60.3, 1),
(72.1, 1);

-- Inserindo dados fictícios na tabela MetricaMemoria
INSERT INTO `innovair`.`MetricaMemoria` (`percentualUso`, `quantidadeLivre`, `quantidadeUsada`, `fkMemoria`)
VALUES
(55.4, 4.5, 5.5, 1),
(60.1, 3.8, 6.2, 1),
(47.9, 5.3, 4.7, 1),
(70.6, 2.9, 7.1, 1),
(80.2, 2.1, 7.9, 1);

-- Inserindo dados fictícios na tabela MetricaDisco
INSERT INTO `innovair`.`MetricaDisco` (`percentualUso`, `quantidadeLivre`, `quantidadeUsada`, `fkDisco`)
VALUES
(40.2, 100.5, 67.8, 1),
(55.8, 80.3, 90.1, 1),
(72.6, 60.0, 120.4, 1),
(81.3, 45.2, 135.6, 1),
(92.7, 25.6, 154.3, 1);


-- Inserindo CPU para o Computador 1
INSERT INTO `innovair`.`CPU` (`modelo`, `frequencia`, `cores`, `fkComputador`)
VALUES ('Intel Core i7', 3.6, 8, 1);

-- Inserindo Memória para o Computador 1
INSERT INTO `innovair`.`Memoria` (`tamanho`, `fkComputador`)
VALUES (16, 1);

-- Inserindo Disco para o Computador 1
INSERT INTO `innovair`.`Disco` (`tipo`, `capacidade`, `montagem`, `sistemaArquivos`, `fkComputador`)
VALUES ('SSD', 512, '/dev/sda1', 'NTFS', 1);

SELECT dataHora , percentualUso FROM MetricaMemoria;
SELECT dataHora, quantidadeLivre , quantidadeUsada FROM MetricaMemoria;

SELECT dataHora , percentualUso  FROM MetricaCPU;


SELECT dataHora, percentualUso FROM MetricaDisco;
                                
SELECT dataHora, quantidadeLivre ,  quantidadeUsada FROM MetricaDisco;


SELECT 'Memória' AS Componente,  mm.percentualUso AS mediaPercentual , mm.dataHora as Horario
                                FROM MetricaMemoria mm
                                UNION ALL
                                SELECT 'Disco',  md.percentualUso, md.dataHora as Horario
                                FROM MetricaDisco md
                                UNION ALL
                                SELECT 'CPU', mc.percentualUso, mc.dataHora as Horario
                                FROM MetricaCPU mc;
                                
SELECT 'Memória' AS Componente, mm.quantidadeLivre AS mediaLivre, mm.quantidadeUsada AS mediaUsada , mm.dataHora as Horario
                                FROM MetricaMemoria mm
                                UNION ALL
                                SELECT 'Disco', md.quantidadeLivre, md.quantidadeUsada, md.dataHora as Horario
                                FROM MetricaDisco md;

SELECT * FROM MetricaDisco;
    
    select * from MetricaDisco;
    
SELECT md.dataHora, md.quantidadeLivre, md.quantidadeUsada
													FROM MetricaDisco md
													JOIN Disco d ON md.fkDisco = d.idDisco
													JOIN Computador c ON d.fkComputador = c.idComputador
													WHERE c.idComputador = 1
													ORDER BY md.dataHora DESC;