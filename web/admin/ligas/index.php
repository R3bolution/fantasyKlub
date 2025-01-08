<?php
session_start();
if (!isset($_SESSION['usuario'])) {
    header("Location: ../login.php");
    exit;
}

include '../plantillas/header.php';

if (isset($_SESSION['mensaje'])) {
    echo "<h2>{$_SESSION['mensaje']}</h2>";
    unset($_SESSION['mensaje']);
}
?>

<h1>Ligas</h1>

<form action="anadir.php" method="post">
    <input type="text" name="nombre" id="nombre" placeholder="Nombre">
    <input type="submit" value="Añadir">
</form>

<?php

include 'tabla.php';

include '../plantillas/footer.php';