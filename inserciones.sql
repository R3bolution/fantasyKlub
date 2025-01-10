USE app_bd;

-- Crear 4 usuarios
INSERT INTO Usuarios (Nombre, Correo, ContraseñaHash)
VALUES 
('Juan Pérez', 'juan.perez@example.com', 'hashed_password_123'),
('Carlos García', 'carlos.garcia@example.com', 'hashed_password_456'),
('Ana López', 'ana.lopez@example.com', 'hashed_password_789'),
('Luis Sánchez', 'luis.sanchez@example.com', 'hashed_password_101');

-- Crear 2 ligas
INSERT INTO Ligas (Nombre)
VALUES 
('Liga Amigos'),
('Liga Rivales');

-- Insertar 15 jugadores
INSERT INTO Jugadores (Nombre, Deporte, Posicion)
VALUES 
('Lionel Messi', 'Fútbol', 'Delantero'),
('Cristiano Ronaldo', 'Fútbol', 'Delantero'),
('LeBron James', 'Baloncesto', 'Alero'),
('Tom Brady', 'Fútbol Americano', 'Quarterback'),
('Roger Federer', 'Tenis', 'Individual'),
('Serena Williams', 'Tenis', 'Individual'),
('Kobe Bryant', 'Baloncesto', 'Escolta'),
('Diego Maradona', 'Fútbol', 'Centrocampista'),
('Zinedine Zidane', 'Fútbol', 'Centrocampista'),
('Stephen Curry', 'Baloncesto', 'Base'),
('Michael Jordan', 'Baloncesto', 'Escolta'),
('Usain Bolt', 'Atletismo', 'Sprinter'),
('Paula Radcliffe', 'Atletismo', 'Maratonista'),
('Tommy Lasorda', 'Béisbol', 'Mánager'),
('Tiger Woods', 'Golf', 'Individual');

-- Obtener los IDs de los usuarios y ligas creados
SET @Usuario1ID = (SELECT UsuarioID FROM Usuarios WHERE Correo = 'juan.perez@example.com');
SET @Usuario2ID = (SELECT UsuarioID FROM Usuarios WHERE Correo = 'carlos.garcia@example.com');
SET @Usuario3ID = (SELECT UsuarioID FROM Usuarios WHERE Correo = 'ana.lopez@example.com');
SET @Usuario4ID = (SELECT UsuarioID FROM Usuarios WHERE Correo = 'luis.sanchez@example.com');

SET @Liga1ID = (SELECT LigaID FROM Ligas WHERE Nombre = 'Liga Amigos');
SET @Liga2ID = (SELECT LigaID FROM Ligas WHERE Nombre = 'Liga Rivales');

-- Asociar los 3 primeros usuarios a la misma liga
INSERT INTO Usuarios_Ligas (UsuarioID, LigaID)
VALUES 
(@Usuario1ID, @Liga1ID),
(@Usuario2ID, @Liga1ID),
(@Usuario3ID, @Liga1ID);

-- Asociar al cuarto usuario a una liga diferente
INSERT INTO Usuarios_Ligas (UsuarioID, LigaID)
VALUES (@Usuario4ID, @Liga2ID);

-- Obtener los UsuarioLigaID para los 4 usuarios
SET @Usuario1LigaID = (SELECT UsuarioLigaID FROM Usuarios_Ligas WHERE UsuarioID = @Usuario1ID AND LigaID = @Liga1ID);
SET @Usuario2LigaID = (SELECT UsuarioLigaID FROM Usuarios_Ligas WHERE UsuarioID = @Usuario2ID AND LigaID = @Liga1ID);
SET @Usuario3LigaID = (SELECT UsuarioLigaID FROM Usuarios_Ligas WHERE UsuarioID = @Usuario3ID AND LigaID = @Liga1ID);
SET @Usuario4LigaID = (SELECT UsuarioLigaID FROM Usuarios_Ligas WHERE UsuarioID = @Usuario4ID AND LigaID = @Liga2ID);

-- Asignar 4 jugadores a cada usuario en la liga
INSERT INTO Plantillas (UsuarioLigaID, JugadorID, Estado, PosicionAlineacion)
VALUES 
-- Usuario 1
(@Usuario1LigaID, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Lionel Messi'), 'ALINEADO', 'Delantero'),
(@Usuario1LigaID, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Cristiano Ronaldo'), 'RESERVADO', 'Delantero'),
(@Usuario1LigaID, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'LeBron James'), 'ALINEADO', 'Alero'),
(@Usuario1LigaID, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Tom Brady'), 'RESERVADO', 'Quarterback'),

-- Usuario 2
(@Usuario2LigaID, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Roger Federer'), 'ALINEADO', 'Individual'),
(@Usuario2LigaID, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Serena Williams'), 'ALINEADO', 'Individual'),
(@Usuario2LigaID, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Kobe Bryant'), 'ALINEADO', 'Escolta'),
(@Usuario2LigaID, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Diego Maradona'), 'RESERVADO', 'Centrocampista'),

-- Usuario 3
(@Usuario3LigaID, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Zinedine Zidane'), 'ALINEADO', 'Centrocampista'),
(@Usuario3LigaID, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Stephen Curry'), 'RESERVADO', 'Base'),
(@Usuario3LigaID, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Michael Jordan'), 'RESERVADO', 'Escolta'),
(@Usuario3LigaID, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Usain Bolt'), 'RESERVADO', 'Sprinter'),

-- Usuario 4
(@Usuario4LigaID, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Paula Radcliffe'), 'ALINEADO', 'Maratonista'),
(@Usuario4LigaID, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Tommy Lasorda'), 'ALINEADO', 'Mánager'),
(@Usuario4LigaID, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Tiger Woods'), 'ALINEADO', 'Individual'),
(@Usuario4LigaID, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Cristiano Ronaldo'), 'RESERVADO', 'Delantero');

-- Crear jornadas
INSERT INTO Jornadas (Jornada, FechaInicio, FechaFin)
VALUES 
(1, '2025-01-01', '2025-01-07'),
(2, '2025-01-08', '2025-01-14'),
(3, '2025-01-15', '2025-01-21');

-- Puntos en jornadas

-- Jornada 1
INSERT INTO Puntuaciones_Jugadores (JugadorID, JornadaID, Puntos)
VALUES 
-- Jornada 1
-- Usuario 1
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Lionel Messi'), 1, 8),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Cristiano Ronaldo'), 1, 7),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'LeBron James'), 1, 6),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Tom Brady'), 1, 5),

-- Usuario 2
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Roger Federer'), 1, 9),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Serena Williams'), 1, 10),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Kobe Bryant'), 1, 6),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Diego Maradona'), 1, 4),

-- Usuario 3
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Zinedine Zidane'), 1, 5),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Stephen Curry'), 1, 7),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Michael Jordan'), 1, 6),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Usain Bolt'), 1, 3),

-- Usuario 4
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Paula Radcliffe'), 1, 8),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Tommy Lasorda'), 1, 2),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Tiger Woods'), 1, 7),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Cristiano Ronaldo'), 1, 6),

-- Jornada 2
-- Usuario 1
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Lionel Messi'), 2, 7),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Cristiano Ronaldo'), 2, 6),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'LeBron James'), 2, 5),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Tom Brady'), 2, 4),

-- Usuario 2
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Roger Federer'), 2, 8),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Serena Williams'), 2, 9),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Kobe Bryant'), 2, 7),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Diego Maradona'), 2, 3),

-- Usuario 3
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Zinedine Zidane'), 2, 4),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Stephen Curry'), 2, 6),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Michael Jordan'), 2, 5),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Usain Bolt'), 2, 2),

-- Usuario 4
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Paula Radcliffe'), 2, 9),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Tommy Lasorda'), 2, 3),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Tiger Woods'), 2, 6),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Cristiano Ronaldo'), 2, 5),

-- Jornada 3
-- Usuario 1
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Lionel Messi'), 3, 6),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Cristiano Ronaldo'), 3, 5),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'LeBron James'), 3, 7),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Tom Brady'), 3, 3),

-- Usuario 2
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Roger Federer'), 3, 10),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Serena Williams'), 3, 8),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Kobe Bryant'), 3, 4),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Diego Maradona'), 3, 5),

-- Usuario 3
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Zinedine Zidane'), 3, 6),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Stephen Curry'), 3, 8),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Michael Jordan'), 3, 7),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Usain Bolt'), 3, 4),

-- Usuario 4
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Paula Radcliffe'), 3, 6),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Tommy Lasorda'), 3, 5),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Tiger Woods'), 3, 9),
((SELECT JugadorID FROM Jugadores WHERE Nombre = 'Cristiano Ronaldo'), 3, 7)
ON DUPLICATE KEY UPDATE Puntos = VALUES(Puntos);


-- Insertar el historial de jugadores para la Jornada 1
-- Usuario 1 - Liga Amigos
INSERT INTO Historial_Jugadores_Liga (UsuarioLigaID, Jornada, JugadorID)
VALUES
(@Usuario1LigaID, 1, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Lionel Messi')),
(@Usuario1LigaID, 1, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'LeBron James')),
(@Usuario1LigaID, 1, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Cristiano Ronaldo'));

-- Usuario 2 - Liga Amigos
INSERT INTO Historial_Jugadores_Liga (UsuarioLigaID, Jornada, JugadorID)
VALUES
(@Usuario2LigaID, 1, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Roger Federer')),
(@Usuario2LigaID, 1, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Serena Williams')),
(@Usuario2LigaID, 1, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Kobe Bryant'));

-- Usuario 3 - Liga Amigos
INSERT INTO Historial_Jugadores_Liga (UsuarioLigaID, Jornada, JugadorID)
VALUES
(@Usuario3LigaID, 1, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Zinedine Zidane')),
(@Usuario3LigaID, 1, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Stephen Curry')),
(@Usuario3LigaID, 1, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Michael Jordan'));

-- Usuario 4 - Liga Rivales
INSERT INTO Historial_Jugadores_Liga (UsuarioLigaID, Jornada, JugadorID)
VALUES
(@Usuario4LigaID, 1, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Paula Radcliffe')),
(@Usuario4LigaID, 1, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Tommy Lasorda')),
(@Usuario4LigaID, 1, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Tiger Woods'));

-- Insertar el historial de jugadores para la Jornada 2
-- Usuario 1 - Liga Amigos
INSERT INTO Historial_Jugadores_Liga (UsuarioLigaID, Jornada, JugadorID)
VALUES
(@Usuario1LigaID, 2, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Lionel Messi')),
(@Usuario1LigaID, 2, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'LeBron James')),
(@Usuario1LigaID, 2, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Cristiano Ronaldo'));

-- Usuario 2 - Liga Amigos
INSERT INTO Historial_Jugadores_Liga (UsuarioLigaID, Jornada, JugadorID)
VALUES
(@Usuario2LigaID, 2, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Roger Federer')),
(@Usuario2LigaID, 2, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Serena Williams')),
(@Usuario2LigaID, 2, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Kobe Bryant'));

-- Usuario 3 - Liga Amigos
INSERT INTO Historial_Jugadores_Liga (UsuarioLigaID, Jornada, JugadorID)
VALUES
(@Usuario3LigaID, 2, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Zinedine Zidane')),
(@Usuario3LigaID, 2, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Stephen Curry')),
(@Usuario3LigaID, 2, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Michael Jordan'));

-- Usuario 4 - Liga Rivales
INSERT INTO Historial_Jugadores_Liga (UsuarioLigaID, Jornada, JugadorID)
VALUES
(@Usuario4LigaID, 2, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Paula Radcliffe')),
(@Usuario4LigaID, 2, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Tommy Lasorda')),
(@Usuario4LigaID, 2, (SELECT JugadorID FROM Jugadores WHERE Nombre = 'Tiger Woods'));
