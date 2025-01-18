<?php
include '../../../plantillas/header.php';
include '../../../../conection.php';

$usuarioID = $_POST['userid'];
$ligaID = $_POST['ligaid'];
if (isset($_POST['jornada'])) {
    $jornadaID = $_POST['jornada'];
} else {
    $jornadaID = null;
}

include 'historial.php';

if (isset($_POST['jugador'])) {
    try {
        $jugadores = $_POST['jugador']; // Array de jugadores enviado desde el formulario
    
        // Validar datos
        if (!$usuarioID || !$ligaID || !$jornadaID || !is_array($jugadores)) {
            throw new Exception("Datos incompletos para actualizar el historial.");
        }

        $jugadoresValidos = array_filter($jugadores, fn($jugadorID) => $jugadorID !== "jugador");

    
        // Verificar duplicados en los jugadores
        if (count($jugadoresValidos) !== count(array_unique($jugadoresValidos))) {
            throw new Exception("No es posible tener jugadores repetidos en el historial.");
        }
    
        // Obtener UsuarioLigaID
        $queryUsuarioLiga = "SELECT UsuarioLigaID FROM Usuarios_Ligas WHERE UsuarioID = :userID AND LigaID = :ligaID";
        $stmtUsuarioLiga = $pdo->prepare($queryUsuarioLiga);
        $stmtUsuarioLiga->execute(['userID' => $usuarioID, 'ligaID' => $ligaID]);
        $usuarioLiga = $stmtUsuarioLiga->fetch(PDO::FETCH_ASSOC);
    
        if (!$usuarioLiga) {
            throw new Exception("No se encontró la relación Usuario-Liga.");
        }
    
        $usuarioLigaID = $usuarioLiga['UsuarioLigaID'];
    
        // Iniciar transacción
        $pdo->beginTransaction();
    
        // Limpiar historial de jugadores de la jornada actual para este UsuarioLigaID
        $queryClear = "DELETE FROM Historial_Jugadores_Liga WHERE UsuarioLigaID = :usuarioLigaID AND Jornada = :jornadaID";
        $stmtClear = $pdo->prepare($queryClear);
        $stmtClear->execute([
            'usuarioLigaID' => $usuarioLigaID,
            'jornadaID' => $jornadaID
        ]);
    
        // Insertar nuevos jugadores o eliminar si el valor es "jugador"
        $queryInsert = "INSERT INTO Historial_Jugadores_Liga (UsuarioLigaID, JugadorID, Jornada) 
                        VALUES (:usuarioLigaID, :jugadorID, :jornadaID)";
        $queryDeleteJugador = "DELETE FROM Historial_Jugadores_Liga WHERE UsuarioLigaID = :usuarioLigaID AND JugadorID = :jugadorID AND Jornada = :jornadaID";
    
        $stmtInsert = $pdo->prepare($queryInsert);
        $stmtDeleteJugador = $pdo->prepare($queryDeleteJugador);
    
        foreach ($jugadores as $jugadorID) {
            if (!empty($jugadorID)) {
                if ($jugadorID === "jugador") {
                    // Eliminar jugador si su valor es "jugador"
                    $stmtDeleteJugador->execute([
                        'usuarioLigaID' => $usuarioLigaID,
                        'jugadorID' => $jugadorID,
                        'jornadaID' => $jornadaID
                    ]);
                } else {
                    // Insertar jugador en el historial
                    $stmtInsert->execute([
                        'usuarioLigaID' => $usuarioLigaID,
                        'jugadorID' => $jugadorID,
                        'jornadaID' => $jornadaID
                    ]);
                }
            }
        }
    
        // Confirmar transacción
        $pdo->commit();
        echo "Historial de jugadores actualizado correctamente.";
    } catch (Exception $e) {
        // Revertir cambios si ocurre un error
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        die("Error: " . $e->getMessage());
    }
    
    
}

if (isset($_POST['jornada']) && $_POST['jornada'] != 'jornada') {
    include 'jugadores.php';
}

include '../../../plantillas/footer.php';