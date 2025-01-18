<?php


try {
    // Consultas SQL
    $queryJornadas = "SELECT * FROM JORNADAS ORDER BY Jornada ASC;";

    // Preparar y ejecutar consultas
    $stmtJornadas = $pdo->query($queryJornadas);
    $jornadas = $stmtJornadas->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("Error al ejecutar las consultas: " . $e->getMessage());
}
?>

<h2>Historial</h2>

<form action="controlador.php" method="post">
    <select name="jornada" id="jornada">
        <option value="jornada">Seleccionar jornada</option>
        <?php foreach ($jornadas as $jornada): ?>
            <option value="<?php echo $jornada['JornadaID']; ?>" <?php if ($jornada['JornadaID'] == $jornadaID) echo 'selected'; ?>>
                <?php echo "Jornada ".$jornada['Jornada']; ?>
            </option>
        <?php endforeach; ?>
    </select>
    <input type="hidden" name="userid" value="<?php echo $usuarioID ?>">
    <input type="hidden" name="ligaid" value="<?php echo $ligaID ?>">

    <input type="submit" value="Seleccionar">
</form>


