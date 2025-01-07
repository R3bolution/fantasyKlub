<?php
session_start();
include 'plantillas/header.php';

if (!isset($_SESSION['usuario'])) {
    header("Location: login.php");
    exit;
}

echo "Bienvenido, " . htmlspecialchars($_SESSION['usuario']);
?>
    <h2>Panel de Control</h2>

    <a href="#">Usuarios</a>
    <a href="jornadas/">Jornadas</a>
    <a href="jugadores/">Jugadores</a>
    <a href="#">Ligas</a>

    <br><a href="logout.php">Cerrar sesion</a>

    
<?php
include 'plantillas/header.php';
?>