# DROP DATABASE innovaair;

CREATE DATABASE IF NOT EXISTS innovaair;
USE innovaair;

# CRIAÇÃO DAS TABELAS
CREATE TABLE IF NOT EXISTS cliente (
  idCliente INT PRIMARY KEY AUTO_INCREMENT,
  razaoSocial VARCHAR(105) NOT NULL,
  cnpj CHAR(18) NOT NULL,
  email VARCHAR(255) NOT NULL,
  telefone VARCHAR(13) NOT NULL
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
  CONSTRAINT fk_filial_cliente FOREIGN KEY (fkCliente) REFERENCES cliente (idCliente),
  CONSTRAINT fk_filial_endereco FOREIGN KEY (fkEndereco) REFERENCES endereco (idEndereco)
);

CREATE TABLE IF NOT EXISTS maquina (
  idMaquina INT PRIMARY KEY AUTO_INCREMENT,
  fkFilial INT NOT NULL, #Fk Não-Relacional // Por ser outro database
  numeroSerial VARCHAR(45) NOT NULL,
  enderecoMac VARCHAR(45) NOT NULL,
  hostname VARCHAR(45) NOT NULL
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

CREATE TABLE IF NOT EXISTS captura_historico (
  idCapturaHistorico INT PRIMARY KEY AUTO_INCREMENT,
  valorCapturado FLOAT NOT NULL,
  momento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fkMetrica INT NOT NULL,
  CONSTRAINT fk_historico_metrica FOREIGN KEY (fkMetrica) REFERENCES metrica (idMetrica)
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
('Terminal 3 - GRU', 'Embarque Internacional', 1, 1),  -- GRU
('Terminal 1 - Galeão', 'Carga Aérea', 2, 2),  -- Galeão
('Terminal de Confins', 'Administrativo', 3, 3),  -- Confins
('Terminal Principal - Afonso Pena', 'Segurança', 4, 4),  -- Curitiba
('Terminal 1 - Salgado Filho', 'Operações', 5, 5);  -- Porto Alegre

SELECT * from maquina;
SELECT * from componente;
SELECT * from metrica;
select * from cliente;
select * from usuario;	
select * from filial;
select * from endereco;
select * from cargo;
SELECT idcargo,nome FROM cargo;

SELECT u.idUsuario, u.nome, u.email as email, u.fkCliente, u.fkCargo FROM usuario u
join cliente c on c.idCliente = u.fkCliente
WHERE u.email = 'inovaair@technology.com' AND u.senha = 'Admin123@';

SELECT * FROM usuario u
join cliente c on c.idCliente = u.fkCliente
WHERE u.email = 'inovaair@technology.com' AND u.senha = 'Admin123@';

SELECT idComponente, componente, metrica, limiteMinimo, limiteMaximo, idMetrica from componente join maquina on idMaquina = fkMaquina join metrica on idComponente = fkComponente where idMaquina = 1;
desc captura_historico;
select * from captura_historico;
# Trigger para inserir os alertas
/*
DELIMITER //
CREATE TRIGGER after_insert_captura
AFTER INSERT ON captura_historico
FOR EACH ROW
BEGIN
    DECLARE v_limite_max INT;
	DECLARE v_limite_min INT;

    -- Busca o limiteMaximo da métrica correspondente
    SELECT limiteMaximo, limiteMinimo
    INTO v_limite_max, v_limite_min
    FROM metrica
    WHERE idMetrica = NEW.fkMetrica;
    
    -- Se o valor da nova captura for maior que o limite, cria alerta
    IF NEW.valorCapturado > v_limite_max THEN
        INSERT INTO captura_alerta (valorCapturado, momento, fkMetrica, gravidade)
        VALUES (NEW.valorCapturado, NOW(), NEW.fkMetrica, 'Grave');
    ELSEIF NEW.valorCapturado >= ((v_limite_min + v_limite_min)/2) and NEW.valorCapturado < v_limite_max THEN
		INSERT INTO captura_alerta (valorCapturado, momento, fkMetrica, gravidade)
        VALUES (NEW.valorCapturado, NOW(), NEW.fkMetrica, 'Médio');
	ELSEIF NEW.valorCapturado < ((v_limite_min + v_limite_min)/2) and NEW.valorCapturado > v_limite_min THEN
		INSERT INTO captura_alerta (valorCapturado, momento, fkMetrica, gravidade)
        VALUES (NEW.valorCapturado, NOW(), NEW.fkMetrica, 'Baixo');   
	ELSE 
		INSERT INTO captura_alerta (valorCapturado, momento, fkMetrica, gravidade)
        VALUES (NEW.valorCapturado, NOW(), NEW.fkMetrica, 'Nenhuma');
    END IF;
END//
DELIMITER ;