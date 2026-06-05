SET NAMES utf8mb4;

CREATE TABLE IF NOT EXISTS journal_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  work_type VARCHAR(35) NOT NULL,
  volume DECIMAL(10,2) NOT NULL,
  unit VARCHAR(50) NOT NULL,
  worker_name VARCHAR(255) NOT NULL,
  INDEX idx_date (date)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS workers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL UNIQUE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS units (
  id INT AUTO_INCREMENT PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  value VARCHAR(255) NOT NULL UNIQUE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT IGNORE INTO workers (label, value) VALUES
  ('Иванов И.И.', 'ivanov'),
  ('Петров П.П.', 'petrov'),
  ('Сидоров С.С.', 'sidorov'),
  ('Алексеев Д.А.', 'alekseev_da'),
  ('Васильев М.Л.', 'vasiliev_ml'),
  ('Егоров И.Т.', 'egorov_it'),
  ('Борисов К.В.', 'borisov_kv'),
  ('Лебедев С.К.', 'lebedev_sk'),
  ('Зайцев Н.Е.', 'zaitsev_ne'),
  ('Дорофеев П.Н.', 'dorofeev_pn'),
  ('Громов А.С.', 'gromov_as'),
  ('Журавлев В.А.', 'zhuravlev_va');

INSERT IGNORE INTO units (label, value) VALUES
  ('м³', 'm3'),
  ('м²', 'm2'),
  ('шт', 'pcs'),
  ('тонн', 'ton'),
  ('п.м.', 'mp');

INSERT IGNORE INTO journal_entries (date, work_type, volume, unit, worker_name) VALUES
  ('2026-06-01', 'Засыпка песка',              12.00,    'm2', 'alekseev_da'),
  ('2026-06-02', 'Армирование',                 2.00,     'ton', 'vasiliev_ml'),
  ('2026-06-02', 'Штукатурка стен',             18.00,    'm2', 'egorov_it'),
  ('2026-06-01', 'Покраска стен',               11.00,    'm2', 'alekseev_da'),
  ('2026-06-02', 'Плиты',                       4.00,     'ton', 'borisov_kv'),
  ('2026-06-02', 'Установка бордюров',          2.00,     'mp', 'vasiliev_ml'),
  ('2026-06-02', 'Земляные работы',             4.00,     'm3', 'vasiliev_ml'),
  ('2026-06-02', 'Установка окон',              45.00,    'pcs', 'lebedev_sk'),
  ('2026-06-02', 'Поклейка обоев',              12.00,    'm2', 'alekseev_da'),
  ('2026-05-26', 'Прокладка труб',              45.00,    'mp', 'borisov_kv'),
  ('2026-06-02', 'Заливка бетона',              89.00,    'm3', 'zaitsev_ne'),
  ('2026-05-27', 'Поклейка обоев',              10.00,    'm2', 'borisov_kv'),
  ('2026-06-02', 'Прокладка кабеля',            1237.00,  'mp', 'dorofeev_pn'),
  ('2026-06-01', 'Стяжка пола',                 12.00,    'm2', 'borisov_kv'),
  ('2026-06-02', 'Покраска стен',               12.00,    'm2', 'gromov_as'),
  ('2026-05-20', 'Установка дверей',            10.00,    'pcs', 'borisov_kv'),
  ('2026-05-21', 'Укладка плитки',              11.00,    'm2', 'vasiliev_ml'),
  ('2026-06-03', 'Установка бордюров',          12.00,    'mp', 'alekseev_da'),
  ('2026-06-02', 'Покраска стен',               45.00,    'm2', 'borisov_kv'),
  ('2026-06-02', 'Штукатурка стен',             12.00,    'm2', 'alekseev_da'),
  ('2026-06-01', 'Установка плинтусов',         12.00,    'mp', 'zaitsev_ne'),
  ('2026-06-02', 'Установка светильников',      45.00,    'pcs', 'zaitsev_ne'),
  ('2026-06-02', 'Прокладка труб',              45.00,    'mp', 'borisov_kv'),
  ('2026-06-02', 'Прокладка труб',              455.00,   'mp', 'gromov_as'),
  ('2026-06-02', 'Засыпка песка',               55.00,    'm3', 'dorofeev_pn'),
  ('2026-06-02', 'Прокладка труб',              12.00,    'mp', 'zhuravlev_va'),
  ('2026-06-02', 'Прокладка труб',              88.00,    'mp', 'egorov_it'),
  ('2026-06-02', 'Прокладка кабеля',            78.00,    'mp', 'dorofeev_pn'),
  ('2026-06-02', 'Покраска стен',               55.00,    'm2', 'dorofeev_pn');

ALTER TABLE journal_entries
  ADD CONSTRAINT fk_worker FOREIGN KEY (worker_name) REFERENCES workers(value) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT fk_unit FOREIGN KEY (unit) REFERENCES units(value) ON DELETE RESTRICT ON UPDATE CASCADE;
