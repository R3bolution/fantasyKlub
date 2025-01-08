<?php
session_start();

if (!isset($_SESSION['usuario'])) {
    header("Location: ../index.php");
    exit;
}

include '../plantillas/header.php';
include '../../conection.php';

$queryJornadas = "SELECT jornada FROM Jornadas";
$queryJugadores = "SELECT * FROM jugadores";

try {
    $stmtJornadas = $pdo->query($queryJornadas);
    $jornadas = $stmtJornadas->fetchAll(PDO::FETCH_ASSOC);

    $stmtJugadores = $pdo->query($queryJugadores);
    $jugadores = $stmtJugadores->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("Error al ejecutar la consulta: " . $e->getMessage());
}

if (!empty($_SESSION['success'])) {
    echo "<h3>{$_SESSION['success']}</h3>";
    unset($_SESSION['success']);
}
?>
<h2>Jornadas</h2>

<form action="" method="get">
    <label for="jornada">Jornada</label>
    <select name="jornada" id="jornada">
        <option value='jornada'>Jornada</option>
        <?php
        foreach ($jornadas as $jornada) {
            $select='';
            if (isset($_GET['jornada']) && $_GET['jornada'] == $jornada['jornada']) {
                $select = 'selected';
            }
            echo "<option value='{$jornada['jornada']}' $select>Jornada {$jornada['jornada']}</option>";
        }
        ?>
    </select>
    <input type="submit" value="Ir a jornada">
</form>
<form action="" method="post">
    <input type="text" name="jornada" id="jornada">
    <input type="text" name="fechaInicio" id="fechaInicio">
    <input type="text" name="fechaFin" id="fechaFin">
    <input type="submit" value="Añadir Jornada">
</form>



<?php

if (isset($_GET['jornada']) && $_GET['jornada'] != 'jornada') {
    echo "<h3>Jornada {$_GET['jornada']}</h3>";
    include 'formPuntos.php';
}


include '../plantillas/footer.php';
?>