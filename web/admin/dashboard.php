<?php
session_start();
include 'plantillas/header.php';



if (!isset($_SESSION['usuario'])) {
    header("Location: login.php");
    exit;
}

echo "Bienvenido, " . htmlspecialchars($_SESSION['usuario']);
?>
    <a href="logout.php">Cerrar sesion</a>
<?php
include 'plantillas/header.php';
?>