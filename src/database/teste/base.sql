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

CREATE TABLE IF NOT EXISTS dados_previsao (
  idPrevisao INT PRIMARY KEY AUTO_INCREMENT,
  valorPrevisto FLOAT NOT NULL,
  isPrevisao TINYINT NOT NULL,
  gravidade VARCHAR(20) NOT NULL,
  momento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fkMetrica INT NOT NULL,
  CONSTRAINT fk_previs_metrica FOREIGN KEY (fkMetrica) REFERENCES metrica (idMetrica)
);

INSERT INTO cliente (razaoSocial, cnpj, email, telefone) VALUES
('InnovaAir', '12345678000188', 'inovaair@technology.com', '1133224455'),
('TAM LINHAS AÉREAS S.A. A LATAM', '12345678000188', 'contato@latam.com.br', '1133224455');

INSERT INTO cargo VALUES
(1, 'Administrador', 7),
(2, 'Gerente', 6),
(3, 'Analista', 5),
(4, 'Tecnico', 4);

INSERT INTO endereco (cep, logradouro, numero, complemento, bairro, cidade, estado, regiao) VALUES
('09560-850', 'Rod. Hélio Smidt', '1', 'Terminal 1', 'Cumbica', 'Guarulhos', 'SP', 'Sudeste'),  -- Aeroporto de GRU
('21041-253', 'Av. Vinte de Janeiro', 's/n', 'Terminal Principal', 'Galeão', 'Rio de Janeiro', 'RJ', 'Sudeste'),  -- Galeão
('31742-010', 'Av. Carlos Drummond', '5.600', 'Terminal 2', 'Confins', 'Belo Horizonte', 'MG', 'Sudeste'),  -- Confins
('81530-900', 'Av. Rocha Pombo', 's/n', 'Terminal de Passageiros', 'Água Verde', 'Curitiba', 'PR', 'Sul'),  -- Afonso Pena
('91010-971', 'Av. Severo Dulius', '9000', 'Terminal 1', 'São João', 'Porto Alegre', 'RS', 'Sul'); -- Salgado Filho

INSERT INTO filial (terminal, setor, fkCliente, fkEndereco) VALUES
('GRU', 'Embarque Internacional', 2, 1),  -- GRU
('Galeão', 'Carga Aérea', 2, 2),  -- Galeão
('de Confins', 'Administrativo', 2, 3),  -- Confins
('Principal - Afonso Pena', 'Segurança', 2, 4),  -- Curitiba
('Salgado Filho', 'Operações', 2, 5);  -- Porto Alegre

INSERT INTO usuario VALUES
(default, 'InnovaAir', 'inovaair@technology.com', 'Admin123@', 1, 1),
(default, 'Roberto', 'roberto@latam.com', 'Senha123@', 2, 2),
(default, 'Estela', 'estela@latam.com', 'Senha123@', 2, 3),
(default, 'Kátia', 'katia@latam.com', 'Senha123@', 2, 4);

INSERT INTO usuarioFilial (fkUsuario, fkFilial) VALUES
(1,1),
(2,2),
(2,3),
(2,4),
(2,5);

# ____________________________________________________________________________________________________________________________________
INSERT INTO filial (terminal, setor, fkCliente, fkEndereco) VALUES
('GRU', 'Embarque Internacional', 2, 1),  -- GRU
('Galeão', 'Carga Aérea', 2, 2),  -- Galeão
('de Confins', 'Administrativo', 2, 3),  -- Confins
('Principal - Afonso Pena', 'Segurança', 2, 4),  -- Curitiba
('Salgado Filho', 'Operações', 2, 5);  -- Porto Alegre
#__________________________________________________________________________________________________________________________________________
INSERT INTO maquina (fkFilial, numeroSerial, enderecoMac, hostname) VALUES
(1, 'SN1001', '00:1A:2B:3C:4D:5E', 'maquina-1'),
(2, 'SN1002', '00:1A:2B:3C:4D:5F', 'maquina-2'),
(1, 'SN1003', '00:1A:2B:3C:4D:60', 'maquina-3'),
(2, 'SN1004', '00:1A:2B:3C:4D:61', 'maquina-4'),
(1, 'SN1005', '00:1A:2B:3C:4D:62', 'maquina-5'),
(2, 'SN1006', '00:1A:2B:3C:4D:63', 'maquina-6'),
(1, 'SN1007', '00:1A:2B:3C:4D:64', 'maquina-7'),
(2, 'SN1008', '00:1A:2B:3C:4D:65', 'maquina-8'),
(4, 'SN1009', '00:1A:2B:3C:4D:66', 'maquina-9'),
(5, 'SN1010', '00:1A:2B:3C:4D:67', 'maquina-10'),
(4, 'SN1001', '00:1A:2B:3C:4D:5E', 'maquina-11'),
(5, 'SN1002', '00:1A:2B:3C:4D:5F', 'maquina-12'),
(4, 'SN1003', '00:1A:2B:3C:4D:60', 'maquina-13'),
(3, 'SN1004', '00:1A:2B:3C:4D:61', 'maquina-14'),
(5, 'SN1005', '00:1A:2B:3C:4D:62', 'maquina-15'),
(3, 'SN1006', '00:1A:2B:3C:4D:63', 'maquina-16'),
(5, 'SN1007', '00:1A:2B:3C:4D:64', 'maquina-17'),
(3, 'SN1008', '00:1A:2B:3C:4D:65', 'maquina-18'),
(4, 'SN1009', '00:1A:2B:3C:4D:66', 'maquina-19'),
(3, 'SN1010', '00:1A:2B:3C:4D:67', 'maquina-20');

# ________________________________________________________________________________________________________________________________________________________
-- Inserir componentes (4 por máquina)
INSERT INTO componente (fkMaquina, componente, especificacao) VALUES
(1, 'Processador', 'Ryzen 3'), (1, 'RAM', 'Kingston 16GB'), (1, 'Armazenamento', 'Samsung SSD 1TB'), (1, 'Rede', 'Intel Gigabit'),
(2, 'Processador', 'Intel i5'), (2, 'RAM', 'Corsair 32GB'), (2, 'Armazenamento', 'WD Blue 2TB'), (2, 'Rede', 'Realtek 1G'),
(3, 'Processador', 'Intel i7'), (3, 'RAM', 'HyperX 8GB'), (3, 'Armazenamento', 'Crucial 1TB'), (3, 'Rede', 'TP-Link 1G'),
(4, 'Processador', 'Ryzen 5'), (4, 'RAM', 'G.Skill 16GB'), (4, 'Armazenamento', 'Seagate 2TB'), (4, 'Rede', 'D-Link 1G'),
(5, 'Processador', 'Intel Xeon'), (5, 'RAM', 'Patriot 8GB'), (5, 'Armazenamento', 'Kingston SSD 500GB'), (5, 'Rede', 'Intel Ethernet'),
(6, 'Processador', 'Ryzen 7'), (6, 'RAM', 'Corsair 16GB'), (6, 'Armazenamento', 'Samsung SSD 2TB'), (6, 'Rede', 'Realtek 2.5G'),
(7, 'Processador', 'Intel i9'), (7, 'RAM', 'Kingston 32GB'), (7, 'Armazenamento', 'WD Black 1TB'), (7, 'Rede', 'TP-Link 1G'),
(8, 'Processador', 'Ryzen 9'), (8, 'RAM', 'G.Skill 8GB'), (8, 'Armazenamento', 'Crucial SSD 2TB'), (8, 'Rede', 'D-Link 2.5G'),
(9, 'Processador', 'Intel Xeon'), (9, 'RAM', 'HyperX 16GB'), (9, 'Armazenamento', 'Seagate 1TB'), (9, 'Rede', 'Intel Gigabit'),
(10, 'Processador', 'Ryzen 5'), (10, 'RAM', 'Corsair 16GB'), (10, 'Armazenamento', 'Kingston 512GB'), (10, 'Rede', 'Intel Ethernet'),

(11, 'Processador', 'Ryzen 3'), (11, 'RAM', 'Kingston 16GB'), (11, 'Armazenamento', 'Samsung SSD 1TB'), (11, 'Rede', 'Intel Gigabit'),
(12, 'Processador', 'Intel i5'), (12, 'RAM', 'Corsair 32GB'), (12, 'Armazenamento', 'WD Blue 2TB'), (12, 'Rede', 'Realtek 1G'),
(13, 'Processador', 'Intel i7'), (13, 'RAM', 'HyperX 8GB'), (13, 'Armazenamento', 'Crucial 1TB'), (13, 'Rede', 'TP-Link 1G'),
(14, 'Processador', 'Ryzen 5'), (14, 'RAM', 'G.Skill 16GB'), (14, 'Armazenamento', 'Seagate 2TB'), (14, 'Rede', 'D-Link 1G'),
(15, 'Processador', 'Intel Xeon'), (15, 'RAM', 'Patriot 8GB'), (15, 'Armazenamento', 'Kingston SSD 500GB'), (15, 'Rede', 'Intel Ethernet'),
(16, 'Processador', 'Ryzen 7'), (16, 'RAM', 'Corsair 16GB'), (16, 'Armazenamento', 'Samsung SSD 2TB'), (16, 'Rede', 'Realtek 2.5G'),
(17, 'Processador', 'Intel i9'), (17, 'RAM', 'Kingston 32GB'), (17, 'Armazenamento', 'WD Black 1TB'), (17, 'Rede', 'TP-Link 1G'),
(18, 'Processador', 'Ryzen 9'), (18, 'RAM', 'G.Skill 8GB'), (18, 'Armazenamento', 'Crucial SSD 2TB'), (18, 'Rede', 'D-Link 2.5G'),
(19, 'Processador', 'Intel Xeon'), (19, 'RAM', 'HyperX 16GB'), (19, 'Armazenamento', 'Seagate 1TB'), (19, 'Rede', 'Intel Gigabit'),
(20, 'Processador', 'Ryzen 5'), (20, 'RAM', 'Corsair 16GB'), (20, 'Armazenamento', 'Kingston 512GB'), (20, 'Rede', 'Intel Ethernet');

# ______________________________________________________________________________________________________________________________________________
-- Inserir métricas para cada componente (supondo ids de componente consecutivos)
-- RAM: porcentagemUso
INSERT INTO metrica (metrica, limiteMinimo, limiteMaximo, fkComponente) VALUES
('porcentagemUso', 20, 90, 2), ('porcentagemUso', 25, 85, 6), ('porcentagemUso', 30, 80, 10), ('porcentagemUso', 20, 95, 14),
('porcentagemUso', 15, 75, 18), ('porcentagemUso', 25, 85, 22), ('porcentagemUso', 30, 80, 26), ('porcentagemUso', 20, 95, 30),
('porcentagemUso', 15, 75, 34), ('porcentagemUso', 25, 85, 38),

-- Processador: porcentagemUso, processos, tempoAtividade
('porcentagemUso', 30, 95, 1), ('processos', 500, 4000, 1), ('tempoAtividade', NULL, NULL, 1),
('porcentagemUso', 35, 90, 5), ('processos', 400, 3000, 5), ('tempoAtividade', NULL, NULL, 5),
('porcentagemUso', 25, 85, 9), ('processos', 200, 2000, 9), ('tempoAtividade', NULL, NULL, 9),
('porcentagemUso', 20, 80, 13), ('processos', 600, 3500, 13), ('tempoAtividade', NULL, NULL, 13),
('porcentagemUso', 30, 95, 17), ('processos', 500, 4000, 17), ('tempoAtividade', NULL, NULL, 17),
('porcentagemUso', 25, 85, 21), ('processos', 300, 2500, 21), ('tempoAtividade', NULL, NULL, 21),
('porcentagemUso', 35, 90, 25), ('processos', 450, 3500, 25), ('tempoAtividade', NULL, NULL, 25),
('porcentagemUso', 20, 80, 29), ('processos', 500, 4000, 29), ('tempoAtividade', NULL, NULL, 29),
('porcentagemUso', 30, 95, 33), ('processos', 350, 3000, 33), ('tempoAtividade', NULL, NULL, 33),
('porcentagemUso', 35, 90, 37), ('processos', 600, 4000, 37), ('tempoAtividade', NULL, NULL, 37),

-- Armazenamento: porcentagemUso
('porcentagemUso', 40, 95, 3), ('porcentagemUso', 30, 85, 7), ('porcentagemUso', 35, 90, 11), ('porcentagemUso', 25, 75, 15),
('porcentagemUso', 30, 85, 19), ('porcentagemUso', 35, 90, 23), ('porcentagemUso', 25, 75, 27), ('porcentagemUso', 30, 85, 31),
('porcentagemUso', 35, 90, 35), ('porcentagemUso', 25, 75, 39),

-- Rede: velocidadeUpload, velocidadeDownload
('velocidadeUpload', 10, 100, 4), ('velocidadeDownload', 20, 200, 4),
('velocidadeUpload', 15, 150, 8), ('velocidadeDownload', 25, 250, 8),
('velocidadeUpload', 20, 120, 12), ('velocidadeDownload', 30, 220, 12),
('velocidadeUpload', 10, 110, 16), ('velocidadeDownload', 20, 210, 16),
('velocidadeUpload', 15, 140, 20), ('velocidadeDownload', 25, 240, 20),
('velocidadeUpload', 20, 130, 24), ('velocidadeDownload', 30, 230, 24),
('velocidadeUpload', 10, 105, 28), ('velocidadeDownload', 20, 205, 28),
('velocidadeUpload', 15, 145, 32), ('velocidadeDownload', 25, 245, 32),
('velocidadeUpload', 20, 135, 36), ('velocidadeDownload', 30, 235, 36),
('velocidadeUpload', 10, 115, 40), ('velocidadeDownload', 20, 215, 40);

INSERT INTO metrica (nomeMetrica, idComponente, valorLimite) VALUES
('usoCPU', 3, 85.0),
('usoCPU', 7, 85.0),
('usoCPU', 11, 85.0),
('usoCPU', 15, 85.0),
('usoCPU', 19, 85.0),
('usoCPU', 23, 85.0),
('usoCPU', 27, 85.0),
('usoCPU', 31, 85.0);

-- Métricas para Armazenamento (Disco)
INSERT INTO metrica (nomeMetrica, idComponente, valorLimite) VALUES
('usoDisco', 4, 90.0),
('usoDisco', 8, 90.0),
('usoDisco', 12, 90.0),
('usoDisco', 16, 90.0),
('usoDisco', 20, 90.0),
('usoDisco', 24, 90.0),
('usoDisco', 28, 90.0),
('usoDisco', 32, 90.0);
# ____________________________________________________________________________________________________________________________________

INSERT INTO captura_alerta (valorCapturado, momento, gravidade, fkMetrica) VALUES
(92.5, '2025-05-30 09:15:00', 'Alto', 11), -- porcentagemUso CPU
(3000, '2025-05-30 09:20:00', 'Médio', 12), -- processos
(75.0, '2025-05-30 09:25:00', 'Alto', 14), -- porcentagemUso RAM

-- Máquina 4 (filial 2) → componentes: 13-16 → métricas: 19 a 26
(85.0, '2025-05-30 09:30:00', 'Médio', 19),
(3500, '2025-05-30 09:35:00', 'Alto', 20),
(90.0, '2025-05-30 09:40:00', 'Crítico', 22),

-- Máquina 6 (filial 2) → componentes: 21-24 → métricas: 27 a 34
(87.5, '2025-05-30 09:45:00', 'Alto', 27),
(240.0, '2025-05-30 09:50:00', 'Crítico', 32),

-- Máquina 8 (filial 2) → componentes: 29-32 → métricas: 35 a 38
(89.0, '2025-05-30 09:55:00', 'Crítico', 35),
(2600, '2025-05-30 10:00:00', 'Médio', 36),

-- Máquina 10 (filial 2) → componentes: 37-40 → métricas: 39 a 42
(78.0, '2025-05-30 10:05:00', 'Alto', 39),
(18.0, '2025-05-30 10:10:00', 'Baixo', 40);

#_____________________________________________________________________________________________________________________________________

INSERT INTO captura_alerta (valorCapturado, momento, gravidade, fkMetrica) VALUES
  (95.73, '2024-12-16 14:23:32', 'Crítica', 55),
  (30.58, '2024-12-25 00:37:49', 'Média', 47),
  (70.68, '2024-12-10 02:07:43', 'Alta', 38),
  (31.02, '2024-12-12 22:00:38', 'Média', 51),
  (45.71, '2024-12-06 21:08:03', 'Alta', 17),
  (92.52, '2024-12-01 00:33:22', 'Crítica', 40),
  (21.72, '2024-12-18 01:03:53', 'Crítica', 25),
  (30.47, '2024-12-15 03:29:01', 'Baixa', 51),
  (43.09, '2024-12-13 12:34:27', 'Alta', 33),
  (26.57, '2024-12-11 19:25:11', 'Alta', 48),
  (36.07, '2024-12-14 01:29:19', 'Baixa', 35),
  (45.6, '2024-12-08 10:07:44', 'Média', 18),
  (59.33, '2024-12-10 10:53:12', 'Média', 51),
  (48.06, '2024-12-01 09:30:52', 'Alta', 13),
  (97.85, '2024-12-07 03:15:45', 'Alta', 11),
  (59.89, '2025-01-18 20:17:53', 'Crítica', 6),
  (43.74, '2025-01-19 02:32:06', 'Média', 4),
  (34.0, '2025-01-15 17:42:05', 'Média', 26),
  (47.9, '2025-01-02 19:52:46', 'Baixa', 41),
  (25.95, '2025-01-04 15:21:21', 'Crítica', 40);

INSERT INTO captura_alerta (valorCapturado, momento, gravidade, fkMetrica) VALUES
  (15.65, '2025-01-12 14:50:16', 'Alta', 46),
  (96.44, '2025-01-09 06:13:12', 'Crítica', 7),
  (56.09, '2025-01-25 18:46:35', 'Crítica', 39),
  (24.89, '2025-01-16 17:34:42', 'Média', 44),
  (70.44, '2025-01-14 05:26:37', 'Baixa', 12),
  (61.6, '2025-01-09 18:54:32', 'Média', 30),
  (84.0, '2025-01-17 13:13:17', 'Alta', 8),
  (20.77, '2025-01-15 19:02:45', 'Média', 23),
  (30.35, '2025-01-26 14:44:41', 'Baixa', 6),
  (80.97, '2025-01-08 16:43:54', 'Baixa', 19),
  (24.11, '2025-01-21 16:28:15', 'Baixa', 57),
  (87.63, '2025-01-01 13:07:20', 'Alta', 10),
  (44.24, '2025-01-15 07:03:55', 'Alta', 41),
  (44.63, '2025-01-22 03:31:59', 'Alta', 48),
  (28.99, '2025-01-26 08:44:00', 'Alta', 8),
  (31.16, '2025-02-09 06:54:08', 'Crítica', 32),
  (29.83, '2025-02-26 12:49:55', 'Crítica', 31),
  (22.71, '2025-02-23 10:08:13', 'Média', 38),
  (34.15, '2025-02-26 11:06:45', 'Baixa', 38),
  (80.24, '2025-02-04 08:55:58', 'Baixa', 49);
  
  
#___________________________________________________________________________________________________________________________
  
  INSERT INTO captura_alerta (valorCapturado, momento, gravidade, fkMetrica) VALUES
-- Dezembro 2024
(82.0, '2024-12-05 10:15:00', 'Alta', 1),
(88.0, '2024-12-10 14:45:20', 'Crítica', 5),
(91.0, '2024-12-13 08:33:11', 'Crítica', 9),
(85.5, '2024-12-15 12:10:30', 'Alta', 13),
(86.2, '2024-12-18 17:25:48', 'Alta', 17),
(92.3, '2024-12-20 09:55:00', 'Crítica', 21),
(79.9, '2024-12-22 16:05:27', 'Média', 25),
(81.0, '2024-12-25 19:40:50', 'Média', 29),
(83.2, '2024-12-28 11:22:19', 'Alta', 33),
(86.9, '2024-12-30 13:14:00', 'Alta', 3),
(90.1, '2024-12-31 15:38:00', 'Crítica', 7),

-- Janeiro 2025
(81.4, '2025-01-02 10:10:00', 'Alta', 2),
(87.5, '2025-01-05 13:20:00', 'Alta', 6),
(89.7, '2025-01-08 17:30:00', 'Crítica', 10),
(93.0, '2025-01-12 19:55:00', 'Crítica', 14),
(84.4, '2025-01-15 07:45:00', 'Alta', 18),
(88.8, '2025-01-18 11:35:00', 'Crítica', 22),
(82.2, '2025-01-20 14:22:00', 'Alta', 26),
(85.3, '2025-01-23 15:15:00', 'Alta', 30),
(87.7, '2025-01-25 16:05:00', 'Alta', 34),

-- Fevereiro 2025
(83.2, '2025-02-03 10:00:00', 'Alta', 1),
(86.9, '2025-02-07 11:22:00', 'Alta', 5),
(92.5, '2025-02-10 13:13:00', 'Crítica', 9),
(90.0, '2025-02-13 08:40:00', 'Crítica', 13),
(85.1, '2025-02-17 09:50:00', 'Alta', 17),
(88.3, '2025-02-21 10:55:00', 'Crítica', 21),
(91.6, '2025-02-23 11:44:00', 'Crítica', 25),
(79.5, '2025-02-26 14:10:00', 'Média', 29),
(81.7, '2025-02-28 18:30:00', 'Alta', 33),

-- Março 2025
(87.5, '2025-03-01 08:50:00', 'Alta', 3),
(89.2, '2025-03-03 10:10:00', 'Crítica', 7),
(91.3, '2025-03-05 11:20:00', 'Crítica', 11),
(86.1, '2025-03-08 15:30:00', 'Alta', 15),
(88.9, '2025-03-10 17:00:00', 'Crítica', 19),
(90.0, '2025-03-13 19:40:00', 'Crítica', 23),
(84.5, '2025-03-16 07:30:00', 'Alta', 27),
(83.8, '2025-03-20 13:55:00', 'Alta', 31),
(95.2, '2025-03-23 20:30:00', 'Crítica', 4),

-- Abril 2025
(92.0, '2025-04-01 09:00:00', 'Crítica', 8),
(94.1, '2025-04-04 11:11:00', 'Crítica', 12),
(86.3, '2025-04-06 13:13:00', 'Alta', 16),
(87.7, '2025-04-10 15:15:00', 'Alta', 20),
(93.5, '2025-04-12 17:17:00', 'Crítica', 24),
(80.0, '2025-04-16 19:19:00', 'Média', 28),
(82.1, '2025-04-18 21:21:00', 'Alta', 32),
(85.0, '2025-04-21 23:23:00', 'Alta', 1),
(88.2, '2025-04-23 01:01:00', 'Crítica', 5),

-- Maio 2025
(91.8, '2025-05-02 08:08:00', 'Crítica', 9),
(89.3, '2025-05-04 10:10:00', 'Crítica', 13),
(87.4, '2025-05-07 12:12:00', 'Alta', 17),
(90.6, '2025-05-10 14:14:00', 'Crítica', 21),
(93.9, '2025-05-12 16:16:00', 'Crítica', 25),
(81.3, '2025-05-15 18:18:00', 'Média', 29),
(84.0, '2025-05-18 20:20:00', 'Alta', 33),
(86.2, '2025-05-21 22:22:00', 'Alta', 3),
(88.7, '2025-05-25 06:06:00', 'Crítica', 7);

#____________________________________________________________________________________________________________________________________
#_____________________________________________________________________________________________________________________________________

select * from cargo;

select * from filial;

select * from usuario;
select * from usuariofilial;

select * from captura_alerta;

select * from metrica;

select * from componente;


SELECT * FROM filial
where fkcliente = 2;

SELECT idUsuario, filial.fkCliente, fkCargo, idFilial FROM usuario
JOIN usuarioFilial
ON fkUsuario = idUsuario
JOIN filial
ON fkFilial = idFilial
JOIN cliente on idCliente = filial.fkCliente
WHERE usuario.email = 'inovaair@technology.com' AND senha = 'Admin123@';

select * from captura_alerta a
join metrica me on a.fkMetrica = me.idMetrica
join componente co on me.fkComponente = co.idComponente
join maquina ma on co.fkMaquina = ma.idMaquina
join filial fi on ma.fkFilial = fi.idFilial;
where fi.fkcliente = 2
group by terminal;

# com filtro de componente
select f.terminal, COUNT(a.idCapturaAlerta) AS total_alertas
from captura_alerta a
join metrica me on a.fkMetrica = me.idMetrica
join componente c ON me.fkComponente = c.idComponente
join maquina m ON c.fkMaquina = m.idMaquina
join filial f ON m.fkFilial = f.idFilial
where f.fkcliente = 2
group by f.terminal
order by f.terminal, total_alertas desc;
    
# sem filtro de componente
SELECT 
	f.terminal,
    c.componente,
    COUNT(a.idCapturaAlerta) AS total_alertas
FROM 
    captura_alerta a
JOIN
	metrica me on a.fkMetrica = me.idMetrica
JOIN 
    componente c ON me.fkComponente = c.idComponente
JOIN 
    maquina m ON c.fkMaquina = m.idMaquina
JOIN 
    filial f ON m.fkFilial = f.idFilial
WHERE
	f.fkcliente = 2
GROUP BY 
    f.terminal, c.componente
ORDER BY 
    f.terminal, total_alertas DESC;

