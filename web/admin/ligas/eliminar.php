<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['id'])) {

    $id = $_POST['id'];

    try {
        include '../../conection.php';
        // Prepara la consulta para insertar el usuario en la liga
        $sql = "DELETE FROM ligas WHERE ligaID=:id";
        $stmt = $pdo->prepare($sql);

        // Asocia los parámetros de la consulta
        $stmt->bindParam(':id', $id, PDO::PARAM_STR);

        // Ejecuta la consulta
        if ($stmt->execute()) {
            echo "Liga se a eliminado exitosamente";
            session_start();
            $_SESSION['mensaje'] = "Liga eliminada exitosamente";
            header("Location: index.php");
        } else {
            echo "Error al eliminar la liga.";
        }
    } catch (PDOException $e) {
        echo "Error al ejecutar la consulta: " . $e->getMessage();
    }
}
?>