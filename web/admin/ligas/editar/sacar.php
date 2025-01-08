<?php
session_start();

// Verifica que el usuario está autenticado
if (!isset($_SESSION['usuario'])) {
    header("Location: ../login.php");
    exit;
}

include '../../../conection.php';

// Verifica que el formulario se haya enviado con POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtiene los valores del formulario
    $userID = $_POST['userid'] ?? null;
    $ligaID = $_POST['ligaid'] ?? null;

    // Valida que ambos valores estén presentes
    if ($userID && $ligaID) {
        // Prepara la consulta para eliminar
        $sql = "DELETE FROM usuarios_ligas WHERE UsuarioID = :userID AND LigaID = :ligaID";

        try {
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':userID' => $userID,
                ':ligaID' => $ligaID,
            ]);

            if ($stmt->rowCount() > 0) {
                echo "El usuario con ID $userID fue eliminado de la liga con ID $ligaID correctamente.";
            } else {
                echo "No se encontró un registro para eliminar.";
            }
        } catch (PDOException $e) {
            echo "Error al eliminar el registro: " . $e->getMessage();
        }
    } else {
        echo "ID de usuario o liga no proporcionados.";
    }
} else {
    echo "Acción no permitida.";
}
?>
