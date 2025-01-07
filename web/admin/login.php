<?php
    include 'plantillas/header.php';
    session_start();
    if (isset($_SESSION['usuario'])) {
        header("Location: dashboard.php");
        exit;
    }
?>
    <form action="index.php" method="post">
        <label for="user">Usuario</label>
        <input type="text" name="user" id="user">
        <label for="password">Contraseña</label>
        <input type="password" name="password" id="password">
        <input type="submit" value="Iniciar sesión">
    </form>

<?php

    include 'plantillas/footer.php';
?>