<?php

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['user'])) {
    $usuarioID = $_POST['user'];
    $ligaID = $_POST['id'];
    try {
        include '../../../conection.php';
        // Prepara la consulta para insertar el usuario en la liga
        $sql = "INSERT INTO usuarios_ligas (usuarioID, ligaID) VALUES (:usuarioID, :ligaID)";
        $stmt = $pdo->prepare($sql);

        // Asocia los parámetros de la consulta
        $stmt->bindParam(':usuarioID', $usuarioID, PDO::PARAM_INT);
        $stmt->bindParam(':ligaID', $ligaID, PDO::PARAM_INT);

        // Ejecuta la consulta
        if ($stmt->execute()) {
            echo "Usuario agregado a la liga con éxito.";
            session_start();
            $_SESSION['mensaje'] = "Liga creada exitosamente";
            $postData = [
                'id' => $ligaID
            ];

            // Redirigir después de la solicitud
            header("Location: editar.php?id={$ligaID}");
        } else {
            echo "Error al agregar el usuario.";
        }
    } catch (PDOException $e) {
        echo "Error al ejecutar la consulta: " . $e->getMessage();
    }
}
?>