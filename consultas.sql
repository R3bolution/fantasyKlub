USE app_bd;

SELECT j.Nombre,p.puntos FROM historial_jugadores_liga h 
JOIN Jugadores j ON h.JugadorID=j.JugadorID
JOIN Puntuaciones_Jugadores p ON h.JugadorID=p.JugadorID
WHERE h.usuarioLigaID = 1 AND h.jornada = 1 AND p.JornadaID=1;