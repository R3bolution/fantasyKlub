<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();
    include '../../conection.php';

    // Validar que se envíe el ID de la jornada
    if (!isset($_POST['jornada']) || !is_numeric($_POST['jornada'])) {
        die("ID de jornada no válido.");
    }
    $jornadaID = (int)$_POST['jornada'];

    // Preparar la consulta SQL con `ON DUPLICATE KEY UPDATE`
    $sql = "
        INSERT INTO Puntuaciones_Jugadores (JugadorID, JornadaID, Puntos)
        VALUES (:jugadorID, :jornadaID, :puntos)
        ON DUPLICATE KEY UPDATE Puntos = VALUES(Puntos)
    ";
    $stmt = $pdo->prepare($sql);

    // Inicializar un array para acumular errores
    $errores = [];

    // Procesar los datos enviados por el formulario
    foreach ($_POST as $key => $value) {
        // Ignorar el campo 'jornada' y validar que las claves sean IDs de jugador
        if ($key !== 'jornada' && is_numeric($key) && is_numeric($value)) {
            $jugadorID = (int)$key;
            $puntos = (int)$value;

            try {
                // Ejecutar la consulta para cada jugador
                $stmt->execute([
                    ':jugadorID' => $jugadorID,
                    ':jornadaID' => $jornadaID,
                    ':puntos' => $puntos
                ]);
            } catch (PDOException $e) {
                // Acumular errores por jugador
                $errores[] = "Error al guardar datos para JugadorID $jugadorID: " . $e->getMessage();
            }
        }
    }

    // Mostrar resultados
    if (!empty($errores)) {
        echo "Ocurrieron los siguientes errores:<br>" . implode('<br>', $errores);
    } else {
        echo "Puntuaciones guardadas correctamente.";
        $_SESSION['success'] = "Puntuaciones guardadas correctamente.";
        header("Location: index.php?jornada=$jornadaID");
    }
} else {
    die("Acceso denegado.");
}
?>
