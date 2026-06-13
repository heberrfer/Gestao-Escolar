export const SUPABASE_SQL_CODE = `-- SQL script for initializing Scolarise database on Supabase client
-- Copy and paste this script directly into your Supabase SQL Editor

-- 1. Safely drop existing tables with cascade to avoid type mismatches on schema updates
DROP TABLE IF EXISTS registro_presenca CASCADE;
DROP TABLE IF EXISTS registro_auditoria CASCADE;
DROP TABLE IF EXISTS ativo_manutencao CASCADE;
DROP TABLE IF EXISTS turmas CASCADE;
DROP TABLE IF EXISTS salas CASCADE;
DROP TABLE IF EXISTS alunos CASCADE;
DROP TABLE IF EXISTS investimentos CASCADE;

-- 2. Create the "salas" table
CREATE TABLE IF NOT EXISTS salas (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  capacidade INTEGER NOT NULL,
  status_ocupacao TEXT NOT NULL DEFAULT 'Livre',
  equipamentos TEXT[] DEFAULT '{}'
);

-- 3. Create the "alunos" table
CREATE TABLE IF NOT EXISTS alunos (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  matricula TEXT NOT NULL UNIQUE,
  turmas TEXT[] DEFAULT '{}',
  frequencia_geral NUMERIC(5,2) DEFAULT 100.0,
  nota_media NUMERIC(3,1) DEFAULT 0.0,
  financeiro_pendencia BOOLEAN DEFAULT FALSE,
  contato_responsavel TEXT,
  nome_responsavel TEXT,
  status_evasao TEXT NOT NULL DEFAULT 'Estável',
  justificativa_evasao TEXT,
  presencas_detalhadas JSONB DEFAULT '{}'::jsonb
);

-- 4. Create the "turmas" table
CREATE TABLE IF NOT EXISTS turmas (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  curso TEXT NOT NULL,
  instrutor_id TEXT NOT NULL,
  instrutor_nome TEXT NOT NULL,
  sala_id TEXT NOT NULL REFERENCES salas(id) ON DELETE CASCADE,
  horario TEXT NOT NULL,
  dias_semana TEXT[] DEFAULT '{}',
  alunos_inscritos TEXT[] DEFAULT '{}'
);

-- 5. Create the "ativo_manutencao" table (Orders de Serviço)
CREATE TABLE IF NOT EXISTS ativo_manutencao (
  id TEXT PRIMARY KEY,
  item TEXT NOT NULL,
  local_id TEXT NOT NULL REFERENCES salas(id) ON DELETE CASCADE,
  local_nome TEXT NOT NULL,
  descricao_problema TEXT NOT NULL,
  solicitado_por TEXT NOT NULL,
  funcao_solicitante TEXT NOT NULL,
  data_solicitacao DATE NOT NULL DEFAULT CURRENT_DATE,
  data_resolucao DATE,
  custo NUMERIC(10,2) DEFAULT 0.0,
  tipo TEXT NOT NULL CHECK (tipo IN ('preventiva', 'corretiva')),
  status TEXT NOT NULL CHECK (status IN ('pendente', 'concluido')) DEFAULT 'pendente',
  prioridade TEXT NOT NULL CHECK (prioridade IN ('Baixa', 'Média', 'Alta')) DEFAULT 'Média'
);

-- 6. Create the "investimentos" table
CREATE TABLE IF NOT EXISTS investimentos (
  id TEXT PRIMARY KEY,
  item TEXT NOT NULL,
  descricao TEXT NOT NULL,
  valor NUMERIC(12,2) NOT NULL DEFAULT 0.0,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  categoria TEXT NOT NULL,
  tipo_gasto TEXT NOT NULL CHECK (tipo_gasto IN ('CAPEX', 'OPEX')),
  autorizado_por TEXT NOT NULL
);

-- 7. Create the "registro_presenca" table (Diário de Classe)
CREATE TABLE IF NOT EXISTS registro_presenca (
  id TEXT PRIMARY KEY,
  aluno_id TEXT NOT NULL REFERENCES alunos(id) ON DELETE CASCADE,
  aluno_nome TEXT NOT NULL,
  turma_id TEXT NOT NULL REFERENCES turmas(id) ON DELETE CASCADE,
  turma_nome TEXT NOT NULL,
  data DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('presente', 'ausente', 'justificado')),
  justificativa TEXT,
  registrado_por TEXT NOT NULL,
  data_lancamento TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  bloqueado_retroativo BOOLEAN DEFAULT TRUE,
  auditorio_alteracao JSONB
);

-- 8. Create the "registro_auditoria" table (Logs)
CREATE TABLE IF NOT EXISTS registro_auditoria (
  id TEXT PRIMARY KEY,
  usuario_nome TEXT NOT NULL,
  usuario_role TEXT NOT NULL,
  acao_descricao TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  modulo_referencia TEXT NOT NULL
);

-- Enable RLS for all tables (Supabase defaults)
ALTER TABLE salas ENABLE ROW LEVEL SECURITY;
ALTER TABLE alunos ENABLE ROW LEVEL SECURITY;
ALTER TABLE turmas ENABLE ROW LEVEL SECURITY;
ALTER TABLE ativo_manutencao ENABLE ROW LEVEL SECURITY;
ALTER TABLE investimentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE registro_presenca ENABLE ROW LEVEL SECURITY;
ALTER TABLE registro_auditoria ENABLE ROW LEVEL SECURITY;

-- Creating anonymous credentials policies (Full CRUD access for anonymous clients)
CREATE POLICY "Permitir leitura anonima" ON salas FOR SELECT TO anon USING (true);
CREATE POLICY "Permitir insercao anonima" ON salas FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Permitir update anonimo" ON salas FOR UPDATE TO anon USING (true);
CREATE POLICY "Permitir delete anonimo" ON salas FOR DELETE TO anon USING (true);

CREATE POLICY "Permitir leitura anonima" ON alunos FOR SELECT TO anon USING (true);
CREATE POLICY "Permitir insercao anonima" ON alunos FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Permitir update anonimo" ON alunos FOR UPDATE TO anon USING (true);
CREATE POLICY "Permitir delete anonimo" ON alunos FOR DELETE TO anon USING (true);

CREATE POLICY "Permitir leitura anonima" ON turmas FOR SELECT TO anon USING (true);
CREATE POLICY "Permitir insercao anonima" ON turmas FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Permitir update anonimo" ON turmas FOR UPDATE TO anon USING (true);
CREATE POLICY "Permitir delete anonimo" ON turmas FOR DELETE TO anon USING (true);

CREATE POLICY "Permitir leitura anonima" ON ativo_manutencao FOR SELECT TO anon USING (true);
CREATE POLICY "Permitir insercao anonima" ON ativo_manutencao FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Permitir update anonimo" ON ativo_manutencao FOR UPDATE TO anon USING (true);
CREATE POLICY "Permitir delete anonimo" ON ativo_manutencao FOR DELETE TO anon USING (true);

CREATE POLICY "Permitir leitura anonima" ON investimentos FOR SELECT TO anon USING (true);
CREATE POLICY "Permitir insercao anonima" ON investimentos FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Permitir update anonimo" ON investimentos FOR UPDATE TO anon USING (true);
CREATE POLICY "Permitir delete anonimo" ON investimentos FOR DELETE TO anon USING (true);

CREATE POLICY "Permitir leitura anonima" ON registro_presenca FOR SELECT TO anon USING (true);
CREATE POLICY "Permitir insercao anonima" ON registro_presenca FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Permitir update anonimo" ON registro_presenca FOR UPDATE TO anon USING (true);
CREATE POLICY "Permitir delete anonimo" ON registro_presenca FOR DELETE TO anon USING (true);

CREATE POLICY "Permitir leitura anonima" ON registro_auditoria FOR SELECT TO anon USING (true);
CREATE POLICY "Permitir insercao anonima" ON registro_auditoria FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Permitir update anonimo" ON registro_auditoria FOR UPDATE TO anon USING (true);
CREATE POLICY "Permitir delete anonimo" ON registro_auditoria FOR DELETE TO anon USING (true);

-- 9. Insert Seed Data (salas)
INSERT INTO salas (id, nome, tipo, capacidade, status_ocupacao, equipamentos) VALUES
('S101', 'Sala de Teoria 101', 'Sala de Aula Comum', 40, 'Ocupada', ARRAY['Ar Condicionado', 'Lousa Digital', 'Projetor HDMI']),
('S102', 'Sala de Teoria 102', 'Sala de Aula Comum', 40, 'Livre', ARRAY['Ar Condicionado', 'Projetor HDMI']),
('L201', 'Laboratório de Software A', 'Laboratório', 32, 'Ocupada', ARRAY['32 Computadores Ryzen 5', 'Ar Condicionado', 'Projetor', 'Git Server']),
('L202', 'Laboratório de Redes e Hardware', 'Laboratório', 24, 'Manutenção', ARRAY['Bancadas Elétricas', 'Switches Cisco', 'Osciloscópios']),
('AUD', 'Auditório Principal', 'Auditório', 120, 'Livre', ARRAY['Sonorização Integrada', 'Palco', 'Projetor Laser 4K', 'Cabine Técnica']),
('OF301', 'Oficina de Automação Industrial', 'Oficina Prática', 20, 'Ocupada', ARRAY['CLPs Siemens', 'Braço Robótico', 'Inversores de Frequência'])
ON CONFLICT (id) DO NOTHING;

-- 10. Insert Seed Data (alunos)
INSERT INTO alunos (id, nome, email, matricula, turmas, frequencia_geral, nota_media, financeiro_pendencia, contato_responsavel, nome_responsavel, status_evasao, justificativa_evasao, presencas_detalhadas) VALUES
('AL_01', 'Lucas Souza Camargo', 'lucas.camargo@aluno.senai.br', 'ALU2026-0032', ARRAY['T_DEV_A', 'T_WEB_B'], 68.2, 5.4, TRUE, '(11) 98112-4099', 'Marilena Souza Camargo', 'Preocupante', 'Faltas consecutivas nas últimas duas semanas e pendência de mensalidade.', '{"T_DEV_A": {"presencas": 24, "ausencias": 14, "aulasTotais": 40, "justificadas": 2}, "T_WEB_B": {"presencas": 13, "ausencias": 3, "aulasTotais": 16, "justificadas": 0}}'::jsonb),
('AL_02', 'Beatriz Helena Dias', 'beatriz.dias@aluno.senai.br', 'ALU2026-0412', ARRAY['T_DEV_A', 'T_REDES'], 89.5, 8.8, FALSE, '(11) 94771-3310', 'Roberto Carlos Dias', 'Estável', NULL, '{"T_DEV_A": {"presencas": 36, "ausencias": 4, "aulasTotais": 40, "justificadas": 0}, "T_REDES": {"presencas": 17, "ausencias": 3, "aulasTotais": 20, "justificadas": 0}}'::jsonb),
('AL_03', 'Matheus Vinícius Oliveira', 'matheus.oliveira@aluno.senai.br', 'ALU2026-0155', ARRAY['T_DEV_A', 'T_REDES'], 74.0, 6.1, FALSE, '(11) 99120-1122', 'Sandro Oliveira', 'Alerta', 'Ausências frequentes às sextas-feiras no período noturno devido a transporte público precário na região do aluno.', '{"T_DEV_A": {"presencas": 30, "ausencias": 10, "aulasTotais": 40, "justificadas": 0}, "T_REDES": {"presencas": 14, "ausencias": 6, "aulasTotais": 20, "justificadas": 0}}'::jsonb),
('AL_04', 'Juliana Mendes Garcia', 'juliana.garcia@aluno.senai.br', 'ALU2026-0309', ARRAY['T_DEV_A', 'T_IND'], 95.0, 9.2, FALSE, '(11) 97722-1988', 'Cláudia Mendes Garcia', 'Estável', NULL, '{"T_DEV_A": {"presencas": 38, "ausencias": 2, "aulasTotais": 40, "justificadas": 0}, "T_IND": {"presencas": 11, "ausencias": 1, "aulasTotais": 12, "justificadas": 0}}'::jsonb),
('AL_05', 'Vitor Hugo Fontes', 'vitor.fontes@aluno.senai.br', 'ALU2026-0227', ARRAY['T_DEV_A', 'T_IND'], 62.5, 4.8, TRUE, '(11) 98111-5544', 'Tereza Cristina Fontes', 'Preocupante', 'Extrema desmotivação e dificuldades de aprendizagem na disciplina de programação.', '{"T_DEV_A": {"presencas": 25, "ausencias": 15, "aulasTotais": 40, "justificadas": 0}, "T_IND": {"presencas": 7, "ausencias": 5, "aulasTotais": 12, "justificadas": 0}}'::jsonb),
('AL_06', 'Mariana Alencar Castro', 'mariana.castro@aluno.senai.br', 'ALU2026-0560', ARRAY['T_DEV_A', 'T_WEB_B'], 98.2, 9.7, FALSE, '(11) 92211-8899', 'Julio Alencar Castro', 'Estável', NULL, '{"T_DEV_A": {"presencas": 39, "ausencias": 1, "aulasTotais": 40, "justificadas": 0}, "T_WEB_B": {"presencas": 16, "ausencias": 0, "aulasTotais": 16, "justificadas": 0}}'::jsonb),
('AL_07', 'Felipe Gabriel Nobre', 'felipe.nobre@aluno.senai.br', 'ALU2026-0288', ARRAY['T_REDES', 'T_WEB_B'], 81.0, 6.8, FALSE, '(11) 99881-2233', 'Patricia Nobre', 'Estável', NULL, '{"T_REDES": {"presencas": 16, "ausencias": 4, "aulasTotais": 20, "justificadas": 0}, "T_WEB_B": {"presencas": 13, "ausencias": 3, "aulasTotais": 16, "justificadas": 0}}'::jsonb),
('AL_08', 'Gustavo Nogueira Silva', 'gustavo.silva@aluno.senai.br', 'ALU2026-0112', ARRAY['T_REDES', 'T_WEB_B'], 71.4, 5.2, TRUE, '(11) 93311-7722', 'Aparecida Nogueira Silva', 'Alerta', 'Atrasos recorrentes devido ao horário de saída do trabalho estagiário do aluno.', '{"T_REDES": {"presencas": 14, "ausencias": 5, "aulasTotais": 20, "justificadas": 1}, "T_WEB_B": {"presencas": 11, "ausencias": 4, "aulasTotais": 16, "justificadas": 1}}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 11. Insert Seed Data (turmas)
INSERT INTO turmas (id, nome, curso, instrutor_id, instrutor_nome, sala_id, horario, dias_semana, alunos_inscritos) VALUES
('T_DEV_A', 'Desenvolvimento de Sistemas - Turma A', 'Técnico em Desenvolvimento de Sistemas', 'prof_marcos', 'Marcos Vinícius Santos', 'L201', '13:30 - 17:30', ARRAY['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'], ARRAY['AL_01', 'AL_02', 'AL_03', 'AL_04', 'AL_05', 'AL_06']),
('T_REDES', 'Infraestrutura de Redes de Computadores', 'Técnico em Redes', 'prof_ana', 'Ana Júlia Pinheiro', 'L202', '19:00 - 22:30', ARRAY['Segunda', 'Quarta', 'Sexta'], ARRAY['AL_07', 'AL_08', 'AL_02', 'AL_03']),
('T_IND', 'Automação e Robótica Avançada', 'Especialização Técnica em Automação', 'prof_ricardo', 'Ricardo Albuquerque', 'OF301', '08:00 - 12:00', ARRAY['Terça', 'Quinta'], ARRAY['AL_09', 'AL_10', 'AL_04', 'AL_05']),
('T_WEB_B', 'Desenvolvimento Front-end Especializado', 'Técnico em Desenvolvimento de Sistemas', 'prof_marcos', 'Marcos Vinícius Santos', 'S101', '19:00 - 22:30', ARRAY['Terça', 'Quinta'], ARRAY['AL_01', 'AL_06', 'AL_07', 'AL_08'])
ON CONFLICT (id) DO NOTHING;

-- 12. Insert Seed Data (ativo_manutencao)
INSERT INTO ativo_manutencao (id, item, local_id, local_nome, descricao_problema, solicitado_por, funcao_solicitante, data_solicitacao, data_resolucao, custo, tipo, status, prioridade) VALUES
('MAN_001', 'Compressor de Ar e Switche Cisco Catalizador', 'L202', 'Laboratório de Redes e Hardware', 'Portas de link principal queimaram devido a surto elétrico e precisam de troca imediata para liberar as aulas.', 'Ana Júlia Pinheiro', 'instrutor', '2026-06-08', NULL, 5400.00, 'corretiva', 'pendente', 'Alta'),
('MAN_002', 'Ar Condicionado Central 24000 BTU', 'L201', 'Laboratório de Software A', 'Limpeza de filtros periódica e recarga de gás refrigerante - agendada contratualmente.', 'Sistema Administrativo', 'coordenador', '2026-06-10', '2026-06-12', 350.00, 'preventiva', 'concluido', 'Média'),
('MAN_003', 'Lousa Digital Samsung Flip', 'S101', 'Sala de Teoria 101', 'Caneta touch original extraviada e receptor bluetooth com instabilidade no encaixe lateral.', 'Marcos Vinícius Santos', 'instrutor', '2026-06-12', NULL, 1200.00, 'corretiva', 'pendente', 'Baixa'),
('MAN_004', 'Braço Robótico e Inversores de Frequência', 'OF301', 'Oficina de Automação Industrial', 'Manutenção sistemática preventiva anual da junta 3 do robô para evitar travamento em aula.', 'Ricardo Albuquerque', 'instrutor', '2026-06-01', '2026-06-03', 4800.00, 'preventiva', 'concluido', 'Alta'),
('MAN_005', 'Reparo de 5 Cadeiras Ergonômicas', 'L201', 'Laboratório de Software A', 'Engrenagens reguladoras de postura travadas e rodinhas quebradas devido a uso intenso.', 'Lucas Souza Camargo', 'aluno', '2026-06-13', NULL, 450.00, 'corretiva', 'pendente', 'Baixa')
ON CONFLICT (id) DO NOTHING;

-- 13. Insert Seed Data (investimentos)
INSERT INTO investimentos (id, item, descricao, valor, data, categoria, tipo_gasto, autorizado_por) VALUES
('INV_001', '32 Computadores Lenovo Ryzen 5, 16GB, SSD 512GB', 'Upgrade completo do parque computacional da Sala L201 de Software, visando rodar ferramentas de desenvolvimento modernas sem gargalos de CPU.', 96000.00, '2026-04-10', 'TI & Equipamentos', 'CAPEX', 'Diretor Heber Ferreira'),
('INV_002', 'Ar Condicionado Cassete Carrier 48000 BTUs', 'Instalação de climatização adequada no Auditório Principal para acomodação de grandes turmas e eventos de formatura.', 18500.00, '2026-05-02', 'Reforma de Ambientes', 'CAPEX', 'Diretor Heber Ferreira'),
('INV_003', 'Kit de 5 Maletas de Redes e Conectores RJ45/Fibra', 'Insumos e kits didáticos práticos para a disciplina de Infraestrutura de Redes e Cabeamento Estruturado.', 4200.00, '2026-06-05', 'Ferramental e Oficinas', 'CAPEX', 'Diretor Heber Ferreira'),
('INV_004', 'Aquisição de Literatura Atualizada e Licenças de E-book', 'Atualização do acervo da Biblioteca Física com manuais técnicos de TypeScript, Engenharia de Software e Banco de dados.', 5800.00, '2026-06-11', 'Biblioteca & Conteúdo', 'CAPEX', 'Diretor Heber Ferreira')
ON CONFLICT (id) DO NOTHING;

-- 14. Insert Seed Data (registro_auditoria)
INSERT INTO registro_auditoria (id, usuario_nome, usuario_role, acao_descricao, timestamp, modulo_referencia) VALUES
('LOG_01', 'Diretor Heber Ferreira', 'diretor', 'Aprovou aporte de CAPEX de R$ 96.000,00 para compra de computadores no Laboratório A.', NOW() - INTERVAL '4 days', 'Financeiro'),
('LOG_02', 'Coordenador Geral G-S', 'coordenador', 'Reagendou grade horária emergencial da Turma B de Web Dev no laboratório para cobrir auditoria técnica.', NOW() - INTERVAL '2 days', 'Grade Horária'),
('LOG_03', 'Marcos Vinícius Santos', 'instrutor', 'Fechamento do diário de chamada da turma Técnico em Desenvolvimento de Sistemas.', NOW() - INTERVAL '1 day', 'Frequência')
ON CONFLICT (id) DO NOTHING;
`;
