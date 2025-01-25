USE app_bd;

SELECT * FROM jugadores 
WHERE NOT EXISTS (
    SELECT 1 
    FROM usuarios_ligas ul
    JOIN plantillas p ON ul.UsuarioLigaID = p.UsuarioLigaID
    WHERE ul.ligaID = 1 AND p.JugadorID = jugadores.JugadorID
);