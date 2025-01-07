<!-- login.php -->
<?php

session_start();


include '../conection.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['user'];
    $password = $_POST['password'];

    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE nombre = :username");
    $stmt->bindParam(':username', $username, PDO::PARAM_STR);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['ContraseñaHash'])) {
        $_SESSION['usuario'] = $user['Nombre'];
        header("Location: dashboard.php");
        exit;
    } else {
        echo "Usuario o contraseña incorrectos.";
    }
}

if (!isset($_SESSION['usuario'])) {
    header("Location: login.php");
    exit;
}
