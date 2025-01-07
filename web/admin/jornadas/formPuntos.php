<?php
$queryJugadores = "SELECT * 
FROM jugadores j
LEFT JOIN puntuaciones_jugadores p 
    ON j.JugadorID = p.JugadorID AND p.JornadaID = {$_GET['jornada']};";
try {
    $stmtJugadores = $pdo->query($queryJugadores);
    $jugadores = $stmtJugadores->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("Error al ejecutar la consulta: " . $e->getMessage());
}

?>

<form action="" method="get">
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Deporte</th>
                <th>Puntos</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($jugadores as $jugador): ?>
                <tr>
                    <td><?php echo $jugador['JugadorID']; ?></td>
                    <td><?php echo $jugador['Nombre']; ?></td>
                    <td><?php echo $jugador['Deporte']; ?></td>
                    <td><input type="text" name="<?php $jugador['JugadorID'] ?>" id="<?php $jugador['JugadorID'] ?>" value="<?php echo $jugador['Puntos'] ?>"></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</form>