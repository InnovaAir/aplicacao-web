 DROP DATABASE innovaair;

CREATE DATABASE IF NOT EXISTS innovaair;
USE innovaair;

# CRIAÇÃO DAS TABELAS
CREATE TABLE IF NOT EXISTS cliente (
  idCliente INT PRIMARY KEY AUTO_INCREMENT,
  razaoSocial VARCHAR(105) NOT NULL,
  cnpj CHAR(14) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(11) NOT NULL
);

CREATE TABLE IF NOT EXISTS cargo (
  idCargo INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  nivelAcesso INT NOT NULL
);

CREATE TABLE IF NOT EXISTS usuario (
  idUsuario INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(45) NOT NULL,
  email VARCHAR(255) NOT NULL,
  senha VARCHAR(30) NOT NULL,
  fkCliente INT NOT NULL,
  fkCargo INT NOT NULL,
  CONSTRAINT fk_usuario_cliente FOREIGN KEY (fkCliente) REFERENCES cliente (idCliente),
  CONSTRAINT fk_usuario_cargo FOREIGN KEY (fkCargo) REFERENCES cargo(idCargo)
);

CREATE TABLE IF NOT EXISTS endereco (
  idEndereco INT PRIMARY KEY AUTO_INCREMENT,
  cep CHAR(9) NOT NULL,
  logradouro VARCHAR(100) NOT NULL,
  numero VARCHAR(45) NOT NULL,
  complemento VARCHAR(45),
  bairro VARCHAR(45) NOT NULL,
  cidade VARCHAR(45) NOT NULL,
  estado VARCHAR(45) NOT NULL,
  regiao VARCHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS filial (
  idFilial INT PRIMARY KEY AUTO_INCREMENT,
  terminal VARCHAR(30) NOT NULL,
  setor VARCHAR(30) NOT NULL,
  fkCliente INT NOT NULL,
  fkEndereco INT NOT NULL,
  CONSTRAINT fk_filial_cliente FOREIGN KEY (fkCliente) REFERENCES cliente(idCliente),
  CONSTRAINT fk_filial_endereco FOREIGN KEY (fkEndereco) REFERENCES endereco (idEndereco)
);

CREATE TABLE IF NOT EXISTS usuarioFilial(
    fkUsuario INT NOT NULL,
    fkFilial INT NOT NULL,
    primary key (fkUsuario, fkFilial)
);

CREATE TABLE IF NOT EXISTS maquina (
  idMaquina INT PRIMARY KEY AUTO_INCREMENT,
  fkFilial INT NOT NULL, #Fk Não-Relacional // Por ser outro database
  numeroSerial VARCHAR(45) NOT NULL,
  enderecoMac VARCHAR(45) NOT NULL,
  nomeModelo VARCHAR(45) NOT NULL,
  hostname VARCHAR(45) NOT NULL,
  CONSTRAINT filialMaquina FOREIGN KEY (fkFilial) REFERENCES filial(idFilial)
);

CREATE TABLE IF NOT EXISTS componente (
  idComponente INT PRIMARY KEY AUTO_INCREMENT,
  fkMaquina INT NOT NULL,
  componente VARCHAR(45) NOT NULL,
  especificacao VARCHAR(100) NOT NULL,
  CONSTRAINT fk_componente_maquina FOREIGN KEY (fkMaquina) REFERENCES maquina (idMaquina)
);

CREATE TABLE IF NOT EXISTS metrica (
  idMetrica INT PRIMARY KEY AUTO_INCREMENT,
  metrica VARCHAR(45) NOT NULL,
  limiteMaximo INT,
  limiteMinimo INT,
  fkComponente INT NOT NULL,
  CONSTRAINT fk_metrica_componente FOREIGN KEY (fkComponente) REFERENCES componente (idComponente)
);

CREATE TABLE IF NOT EXISTS captura_alerta (
  idCapturaAlerta INT PRIMARY KEY AUTO_INCREMENT,
  valorCapturado FLOAT NOT NULL,
  momento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  gravidade VARCHAR(20) NOT NULL,
  fkMetrica INT NOT NULL,
  CONSTRAINT fk_alerta_metrica FOREIGN KEY (fkMetrica) REFERENCES metrica (idMetrica)
);



-- select com informações do modelo + alertas dos modelos
SELECT 
    maquina.idMaquina,
    maquina.numeroSerial,
    maquina.enderecoMac,
    maquina.nomeModelo,
    maquina.hostname,
    maquina.fkFilial,
    componente.componente,
    componente.especificacao,
    metrica.metrica,
    metrica.limiteMinimo,
    metrica.limiteMaximo,
    metrica.fkComponente,
    metrica.idMetrica,
    captura_alerta.valorCapturado,
    captura_alerta.momento,
    captura_alerta.gravidade
FROM maquina
LEFT JOIN componente ON componente.fkMaquina = maquina.idMaquina
LEFT JOIN metrica ON metrica.fkComponente = componente.idComponente
LEFT JOIN captura_alerta ON captura_alerta.fkMetrica = metrica.idMetrica
WHERE maquina.fkFilial = 1;
