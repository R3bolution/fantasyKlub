<?php
session_start();
if (!isset($_SESSION['usuario'])) {
    header("Location: ../login.php");
    exit;
}

include '../plantillas/header.php';

?>

<h1>Ligas</h1>

<a href="crear.php">Crear liga</a>

<?php

include 'tabla.php';

include '../plantillas/footer.php';