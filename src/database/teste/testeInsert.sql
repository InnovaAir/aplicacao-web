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


INSERT INTO metrica (metrica, limiteMinimo, limiteMaximo, fkComponente) VALUES
-- Processadores (idComponente: 1,5,9,...)
('porcentagemUso', 30, 95, 1), ('processos', 500, 4000, 1), ('tempoAtividade', NULL, NULL, 1),
('porcentagemUso', 35, 90, 5), ('processos', 400, 3000, 5), ('tempoAtividade', NULL, NULL, 5),
('porcentagemUso', 25, 85, 9), ('processos', 200, 2000, 9), ('tempoAtividade', NULL, NULL, 9),
('porcentagemUso', 20, 80, 13), ('processos', 600, 3500, 13), ('tempoAtividade', NULL, NULL, 13),

-- RAM (idComponente: 2,6,10,...)
('porcentagemUso', 20, 90, 2), ('porcentagemUso', 25, 85, 6), ('porcentagemUso', 30, 80, 10), ('porcentagemUso', 20, 95, 14),

-- Armazenamento (idComponente: 3,7,11,...)
('porcentagemUso', 40, 95, 3), ('porcentagemUso', 30, 85, 7), ('porcentagemUso', 35, 90, 11), ('porcentagemUso', 25, 75, 15),

-- Rede (idComponente: 4,8,12,...)
('velocidadeUpload', 10, 100, 4), ('velocidadeDownload', 20, 200, 4),
('velocidadeUpload', 15, 150, 8), ('velocidadeDownload', 25, 250, 8),
('velocidadeUpload', 20, 120, 12), ('velocidadeDownload', 30, 220, 12),
('velocidadeUpload', 10, 110, 16), ('velocidadeDownload', 20, 210, 16);



INSERT INTO captura_alerta (valorCapturado, momento, gravidade, fkMetrica) VALUES
(58.71, '2024-12-22 08:03:33', 'Baixa', 25),
(63.77, '2024-12-07 14:19:12', 'Média', 65),
(66.56, '2024-12-11 18:36:59', 'Crítica', 41),
(45.19, '2024-12-13 20:36:54', 'Baixa', 26),
(20.04, '2024-12-12 07:38:24', 'Alta', 61);