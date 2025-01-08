<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['nombre'])) {

    $nombre = $_POST['nombre'];

    try {
        include '../../conection.php';
        // Prepara la consulta para insertar el usuario en la liga
        $sql = "INSERT INTO ligas (Nombre) VALUES (:Nombre)";
        $stmt = $pdo->prepare($sql);

        // Asocia los parámetros de la consulta
        $stmt->bindParam(':Nombre', $nombre, PDO::PARAM_STR);

        // Ejecuta la consulta
        if ($stmt->execute()) {
            echo "Liga creada exitosamente";
            session_start();
            $_SESSION['mensaje'] = "Liga creada exitosamente";
            header("Location: index.php");
        } else {
            echo "Error al crear la liga.";
        }
    } catch (PDOException $e) {
        echo "Error al ejecutar la consulta: " . $e->getMessage();
    }
}
?>