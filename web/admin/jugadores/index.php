<?php

include '../plantillas/header.php';
include '../../conection.php';

$queryJugadores = "SELECT * FROM jugadores";

try {
    $stmtJugadores = $pdo->query($queryJugadores);
    $jugadores = $stmtJugadores->fetchAll(PDO::FETCH_ASSOC);


} catch (PDOException $e) {
    die("Error al ejecutar la consulta: " . $e->getMessage());
}
?>
    <h2>Jugadores</h2>

    
    <a href="#">Añadir Jugador</a>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Deporte</th>
                <th>Posicion</th>
                <th>Accion</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($jugadores as $jugador): ?>
                <tr>
                    <td><?php echo $jugador['JugadorID']; ?></td>
                    <td><?php echo $jugador['Nombre']; ?></td>
                    <td><?php echo $jugador['Deporte']; ?></td>
                    <td><?php echo $jugador['Posicion']; ?></td>
                    <td>
                        <a href="editar.php?id=<?php echo $jugador['JugadorID']; ?>">Editar</a>
                        <a href="eliminar.php?id=<?php echo $jugador['JugadorID']; ?>">Eliminar</a>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
<?php
    include '../plantillas/footer.php';
?>