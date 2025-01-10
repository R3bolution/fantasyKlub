<?php

include '../../../plantillas/header.php';
include '../../../../conection.php';

// Consultas para obtener los datos de jugadores y plantilla
$queryJugadores = "SELECT jugadorID, nombre FROM jugadores;";
$queryPlantilla = "SELECT p.jugadorID 
                   FROM plantillas p
                   JOIN usuarios_ligas ul ON p.usuarioLigaID = ul.usuarioLigaID
                   WHERE ul.usuarioID = 5 AND ul.ligaID = 1 AND estado = 'ALINEADO';";

try {
    // Ejecutar consultas
    $stmtJugadores = $pdo->query($queryJugadores);
    $jugadores = $stmtJugadores->fetchAll(PDO::FETCH_ASSOC);

    $stmtPlantilla = $pdo->query($queryPlantilla);
    $plantilla = $stmtPlantilla->fetchAll(PDO::FETCH_ASSOC);

    // Validar resultados
    if (!$jugadores) {
        die("No se encontraron jugadores.");
    }
    if (!$plantilla) {
        $plantilla = []; // Si no hay resultados, inicializa como un array vacío
    }

    // Extraer IDs de la plantilla
    $plantillaIDs = array_column($plantilla, 'jugadorID');

} catch (PDOException $e) {
    die("Error al ejecutar la consulta: " . $e->getMessage());
}

// Depuración opcional
// print_r($plantilla);
// print_r($plantillaIDs);

// Copia de plantilla para consumirla progresivamente
$plantillaRestante = $plantillaIDs;

?>
<h2>Editar Liga</h2>
<form action="sacar.php" method="post">
    <table>
        <thead>
            <tr>
                <th>Jugadores</th>
            </tr>
        </thead>
        <tbody>
            <?php for ($i = 0; $i < 3; $i++): ?>
            <tr>
                <td>
                    <select name="jugador<?php echo $i ?>" id="jugador">
                        <option value="">Seleccionar jugador</option>
                        <?php 
                        // Jugador seleccionado para este select
                        $jugadorSeleccionado = isset($plantillaRestante[$i]) ? $plantillaRestante[$i] : null;
                        foreach ($jugadores as $jugador): 
                            // Verifica si este jugador es el seleccionado para este select
                            $select = ($jugador['jugadorID'] == $jugadorSeleccionado) ? 'selected' : ''; 
                        ?>
                            <option value="<?php echo $jugador['jugadorID']; ?>" <?php echo $select; ?>>
                                <?php echo htmlspecialchars($jugador['nombre']); ?>
                            </option>
                        <?php endforeach; ?>
                    </select>
                </td>
            </tr>
            <?php endfor; ?>
        </tbody>
    </table>
    <button type="submit">Sacar</button>
</form>
<?php

include '../../../plantillas/footer.php';
?>
