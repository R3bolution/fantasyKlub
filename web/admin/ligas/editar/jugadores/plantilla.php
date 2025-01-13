<?php
include '../../../plantillas/header.php';

// Obtener userID y ligaID desde POST


try {
    // Consultas SQL
    $queryJugadores = "SELECT jugadorID, nombre FROM jugadores;";
    $queryPlantilla = "SELECT p.jugadorID 
                       FROM plantillas p
                       JOIN usuarios_ligas ul ON p.usuarioLigaID = ul.usuarioLigaID
                       WHERE ul.usuarioID = :userID AND ul.ligaID = :ligaID AND estado = 'ALINEADO';";
    $queryReserva = "SELECT p.jugadorID, j.nombre
                     FROM plantillas p
                     JOIN usuarios_ligas ul ON p.usuarioLigaID = ul.usuarioLigaID
                     JOIN jugadores j ON p.jugadorID = j.jugadorID
                     WHERE ul.usuarioID = :userID AND ul.ligaID = :ligaID AND estado != 'ALINEADO';";

    // Preparar y ejecutar consultas
    $stmtJugadores = $pdo->query($queryJugadores);
    $jugadores = $stmtJugadores->fetchAll(PDO::FETCH_ASSOC);

    $stmtPlantilla = $pdo->prepare($queryPlantilla);
    $stmtPlantilla->execute(['userID' => $userID, 'ligaID' => $ligaID]);
    $plantilla = $stmtPlantilla->fetchAll(PDO::FETCH_ASSOC);

    $stmtReserva = $pdo->prepare($queryReserva);
    $stmtReserva->execute(['userID' => $userID, 'ligaID' => $ligaID]);
    $reserva = $stmtReserva->fetchAll(PDO::FETCH_ASSOC);

    // Extraer IDs
    $plantillaIDs = array_column($plantilla, 'jugadorID');
    $reservaIDs = array_column($reserva, 'jugadorID');

} catch (PDOException $e) {
    die("Error al ejecutar las consultas: " . $e->getMessage());
}
?>

<h2>Editar plantilla jugador <?php echo $userID;?></h2>

<form action="controlador.php" method="post">
    <input type="hidden" name="userid" value="<?php echo htmlspecialchars($userID); ?>">
    <input type="hidden" name="ligaid" value="<?php echo htmlspecialchars($ligaID); ?>">

    <table>
        <thead>
            <tr>
                <th>Jugadores alineados</th>
            </tr>
        </thead>
        <tbody>
            <?php for ($i = 0; $i < 3; $i++): ?>
                <tr>
                    <td>
                        <select name="jugador[]">
                            <option value="">Seleccionar jugador</option>
                            <?php 
                            $jugadorSeleccionado = $plantillaIDs[$i] ?? null;
                            foreach ($jugadores as $jugador): 
                                $selected = ($jugador['jugadorID'] == $jugadorSeleccionado) ? 'selected' : ''; 
                            ?>
                                <option value="<?php echo $jugador['jugadorID']; ?>" <?php echo $selected; ?>>
                                    <?php echo htmlspecialchars($jugador['nombre']); ?>
                                </option>
                            <?php endforeach; ?>
                        </select>
                    </td>
                </tr>
            <?php endfor; ?>
        </tbody>
    </table>
    <?php
    if (isset($error)) {
        echo "<p>$error</p>";
    }
    ?>
    <button type="submit" name="plantilla">Actualizar</button>
</form>

<h2>Reserva</h2>

<h3>Jugadores en reserva</h3>
<?php if ($reserva): ?>
    <table>
        <thead>
            <tr>
                <th>Jugador</th>
                <th>Acción</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($reserva as $jugador): 
                if (empty($jugador['jugadorID'])) {
                    echo "<p>No hay jugadores en reserva.</p>";
                    break;
                }
                ?>
                <tr>
                    <td><?php echo htmlspecialchars($jugador['nombre']); ?></td>
                    <td>
                        <form action="controlador.php" method="post">
                            <input type="hidden" name="jugadorID" value="<?php echo $jugador['jugadorID']; ?>">
                            <input type="hidden" name="userid" value="<?php echo htmlspecialchars($userID); ?>">
                            <input type="hidden" name="ligaid" value="<?php echo htmlspecialchars($ligaID); ?>">
                            <button type="submit" name="sacar">Sacar</button>
                        </form>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
<?php else: ?>
    <p>No hay jugadores en reserva.</p>
<?php endif; ?>

<h3>Añadir jugador a reserva</h3>
<form action="controlador.php" method="post">
    <input type="hidden" name="userid" value="<?php echo htmlspecialchars($userID); ?>">
    <input type="hidden" name="ligaid" value="<?php echo htmlspecialchars($ligaID); ?>">

    <select name="jugadorID">
        <option value="">Seleccionar jugador</option>
        <?php foreach ($jugadores as $jugador): 
            if (!in_array($jugador['jugadorID'], $plantillaIDs) && !in_array($jugador['jugadorID'], $reservaIDs)): ?>
                <option value="<?php echo $jugador['jugadorID']; ?>">
                    <?php echo htmlspecialchars($jugador['nombre']); ?>
                </option>
        <?php endif; endforeach; ?>
    </select>
    <button type="submit" name="agregar">Agregar</button>
</form>

<?php include '../../../plantillas/footer.php'; ?>
