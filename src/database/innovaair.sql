# DROP DATABASE innovaair;

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

INSERT INTO cliente (razaoSocial, cnpj, email, telefone) VALUES
('InnovaAir', '12345678000188', 'inovaair@technology.com', '1133224455'),
('TAM LINHAS AÉREAS S.A. A LATAM', '12345678000188', 'contato@latam.com.br', '1133224455');

INSERT INTO cargo VALUES
(1, 'Administrador', 7),
(2, 'Gerente', 6),
(3, 'Analista', 5),
(4, 'Tecnico', 4);

INSERT INTO usuario VALUES
(default, 'InnovaAir', 'inovaair@technology.com', 'Admin123@', 1, 1),
(default, 'Roberto', 'roberto@latam.com', 'Senha123@', 2, 2),
(default, 'Estela', 'estela@latam.com', 'Senha123@', 2, 3),
(default, 'Kátia', 'katia@latam.com', 'Senha123@', 2, 4);

INSERT INTO endereco (cep, logradouro, numero, complemento, bairro, cidade, estado, regiao) VALUES
('09560-850', 'Rod. Hélio Smidt', '1', 'Terminal 1', 'Cumbica', 'Guarulhos', 'SP', 'Sudeste'),  -- Aeroporto de GRU
('21041-253', 'Av. Vinte de Janeiro', 's/n', 'Terminal Principal', 'Galeão', 'Rio de Janeiro', 'RJ', 'Sudeste'),  -- Galeão
('31742-010', 'Av. Carlos Drummond', '5.600', 'Terminal 2', 'Confins', 'Belo Horizonte', 'MG', 'Sudeste'),  -- Confins
('81530-900', 'Av. Rocha Pombo', 's/n', 'Terminal de Passageiros', 'Água Verde', 'Curitiba', 'PR', 'Sul'),  -- Afonso Pena
('91010-971', 'Av. Severo Dulius', '9000', 'Terminal 1', 'São João', 'Porto Alegre', 'RS', 'Sul'); -- Salgado Filho

INSERT INTO filial (terminal, setor, fkCliente, fkEndereco) VALUES
('GRU', 'Embarque Internacional', 1, 1),  -- GRU
('Galeão', 'Carga Aérea', 2, 2),  -- Galeão
('de Confins', 'Administrativo', 2, 3),  -- Confins
('Principal - Afonso Pena', 'Segurança', 2, 4),  -- Curitiba
('Salgado Filho', 'Operações', 2, 5);  -- Porto Alegre