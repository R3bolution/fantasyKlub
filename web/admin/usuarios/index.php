<?php
session_start();
if (!isset($_SESSION['usuario'])) {
    header("Location: ../login.php");
    exit;
}

include '../plantillas/header.php';

?>

<h1>Usuarios</h1>

<a href="crear.php">Crear usuario</a>

<?php

include 'tabla.php';

include '../plantillas/footer.php';