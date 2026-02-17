create database IA_WhatsApp;
use IA_WhatsApp;

CREATE TABLE ticket (
  id INT AUTO_INCREMENT PRIMARY KEY,
  consulta_id INT NOT NULL,
  mensaje TEXT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_consulta
    FOREIGN KEY (consulta_id)
    REFERENCES consultas(id)
    ON DELETE CASCADE
); 
ALTER TABLE ticket
ADD COLUMN archivo VARCHAR(255) NULL;
ALTER TABLE ticket
MODIFY mensaje TEXT NULL;


CREATE TABLE consultas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  numero VARCHAR(20) NOT NULL,
  nombre VARCHAR(100),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ver estructura de las tablas --
describe ticket;
describe consultas;

-- Ver contenido de las tablas --
select * from ticket;
select * from consultas;

-- Eliminar contenido de las tablas --
TRUNCATE ticket;
TRUNCATE consultas;

-- eliminar contenido en base a condicionales --
delete from consultas where id >=1;
DELETE FROM ticket where id >= 1;