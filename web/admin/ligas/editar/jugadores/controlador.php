<?php

include '../../../../conection.php';

$userID = $_POST['userid'] ?? null;
$ligaID = $_POST['ligaid'] ?? null;

if (!$userID || !$ligaID) {
    die("Faltan datos necesarios.");
}

if (isset($_POST['plantilla'])) {
    try {
        $jugadores = $_POST['jugador'];

        // Validar datos
        if (!$userID || !$ligaID || !is_array($jugadores)) {
            throw new Exception("Datos incompletos para actualizar la plantilla.");
        }

        // Verificar duplicados en la plantilla
        if (count($jugadores) !== count(array_unique($jugadores))) {
            throw new Exception("No es posible tener jugadores repetidos en la plantilla.");
        }

        // Obtener UsuarioLigaID
        $queryUsuarioLiga = "SELECT UsuarioLigaID FROM Usuarios_Ligas WHERE UsuarioID = :userID AND LigaID = :ligaID";
        $stmtUsuarioLiga = $pdo->prepare($queryUsuarioLiga);
        $stmtUsuarioLiga->execute(['userID' => $userID, 'ligaID' => $ligaID]);
        $usuarioLiga = $stmtUsuarioLiga->fetch(PDO::FETCH_ASSOC);

        if (!$usuarioLiga) {
            throw new Exception("No se encontró la relación Usuario-Liga.");
        }

        $usuarioLigaID = $usuarioLiga['UsuarioLigaID'];

        // Actualizar plantilla
        $pdo->beginTransaction();

        // Limpiar jugadores alineados actuales
        $queryClear = "DELETE FROM Plantillas WHERE UsuarioLigaID = :usuarioLigaID AND Estado = 'ALINEADO'";
        $stmtClear = $pdo->prepare($queryClear);
        $stmtClear->execute(['usuarioLigaID' => $usuarioLigaID]);

        // Insertar nuevos jugadores alineados
        $queryInsert = "INSERT INTO Plantillas (UsuarioLigaID, JugadorID, Estado, PosicionAlineacion) 
                        VALUES (:usuarioLigaID, :jugadorID, 'ALINEADO', :posicion)";
        $stmtInsert = $pdo->prepare($queryInsert);

        foreach ($jugadores as $posicion => $jugadorID) {
            if (!empty($jugadorID)) {
                $stmtInsert->execute([
                    'usuarioLigaID' => $usuarioLigaID,
                    'jugadorID' => $jugadorID,
                    'posicion' => "Posicion " . ($posicion + 1)
                ]);
            }
        }

        $pdo->commit();
        echo "Plantilla actualizada correctamente.";

    } catch (Exception $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        $error= "Error: " . $e->getMessage();
    }

    if (isset($_POST['sacar'])) {
        try {
            // Obtener datos del formulario
            $jugadorID = $_POST['RjugadorID'] ?? null;
            $userID = $_POST['RuserID'] ?? null;
            $ligaID = $_POST['RligaID'] ?? null;
    
            // Validar datos
            if (!$jugadorID || !$userID || !$ligaID) {
                throw new Exception("Faltan datos necesarios para procesar la solicitud.");
            }
    
            // Obtener UsuarioLigaID
            $queryUsuarioLiga = "SELECT UsuarioLigaID FROM Usuarios_Ligas WHERE UsuarioID = :userID AND LigaID = :ligaID";
            $stmtUsuarioLiga = $pdo->prepare($queryUsuarioLiga);
            $stmtUsuarioLiga->execute(['userID' => $userID, 'ligaID' => $ligaID]);
            $usuarioLiga = $stmtUsuarioLiga->fetch(PDO::FETCH_ASSOC);
    
            if (!$usuarioLiga) {
                throw new Exception("No se encontró la relación Usuario-Liga.");
            }
    
            $usuarioLigaID = $usuarioLiga['UsuarioLigaID'];
    
            // Eliminar el jugador de la tabla Plantillas
            $queryDelete = "DELETE FROM Plantillas WHERE UsuarioLigaID = :usuarioLigaID AND JugadorID = :jugadorID";
            $stmtDelete = $pdo->prepare($queryDelete);
            $stmtDelete->execute([
                'usuarioLigaID' => $usuarioLigaID,
                'jugadorID' => $jugadorID,
            ]);
    
            if ($stmtDelete->rowCount() > 0) {
                echo "Jugador eliminado correctamente de la plantilla.";
            } else {
                echo "El jugador no está en la plantilla o ya fue eliminado.";
            }
        } catch (Exception $e) {
            die("Error: " . $e->getMessage());
        }
    }
}

if (isset($_POST['sacar'])) {
    try {
        // Obtener datos del formulario
        $jugadorID = $_POST['jugadorID'] ?? null;

        // Validar datos
        if (!$jugadorID || !$userID || !$ligaID) {
            throw new Exception("Faltan datos necesarios para procesar la solicitud.");
        }

        // Obtener UsuarioLigaID
        $queryUsuarioLiga = "SELECT UsuarioLigaID FROM Usuarios_Ligas WHERE UsuarioID = :userID AND LigaID = :ligaID";
        $stmtUsuarioLiga = $pdo->prepare($queryUsuarioLiga);
        $stmtUsuarioLiga->execute(['userID' => $userID, 'ligaID' => $ligaID]);
        $usuarioLiga = $stmtUsuarioLiga->fetch(PDO::FETCH_ASSOC);

        if (!$usuarioLiga) {
            throw new Exception("No se encontró la relación Usuario-Liga.");
        }

        $usuarioLigaID = $usuarioLiga['UsuarioLigaID'];

        // Eliminar el jugador de la tabla Plantillas
        $queryDelete = "DELETE FROM Plantillas WHERE UsuarioLigaID = :usuarioLigaID AND JugadorID = :jugadorID";
        $stmtDelete = $pdo->prepare($queryDelete);
        $stmtDelete->execute([
            'usuarioLigaID' => $usuarioLigaID,
            'jugadorID' => $jugadorID,
        ]);

        if ($stmtDelete->rowCount() > 0) {
            echo "Jugador eliminado correctamente de la plantilla.";
        } else {
            echo "El jugador no está en la plantilla o ya fue eliminado.";
        }
    } catch (Exception $e) {
        die("Error: " . $e->getMessage());
    }
}

if (isset($_POST['agregar'])) {
    try {
        // Obtener datos del formulario
        $jugadorID = $_POST['jugadorID'] ?? null;

        // Validar datos
        if (!$jugadorID || !$userID || !$ligaID) {
            throw new Exception("Faltan datos necesarios para agregar el jugador.");
        }

        // Obtener UsuarioLigaID
        $queryUsuarioLiga = "SELECT UsuarioLigaID FROM Usuarios_Ligas WHERE UsuarioID = :userID AND LigaID = :ligaID";
        $stmtUsuarioLiga = $pdo->prepare($queryUsuarioLiga);
        $stmtUsuarioLiga->execute(['userID' => $userID, 'ligaID' => $ligaID]);
        $usuarioLiga = $stmtUsuarioLiga->fetch(PDO::FETCH_ASSOC);

        if (!$usuarioLiga) {
            throw new Exception("No se encontró la relación Usuario-Liga.");
        }

        $usuarioLigaID = $usuarioLiga['UsuarioLigaID'];

        // Verificar si el jugador ya está en la plantilla o reserva
        $queryCheck = "SELECT 1 FROM Plantillas WHERE UsuarioLigaID = :usuarioLigaID AND JugadorID = :jugadorID";
        $stmtCheck = $pdo->prepare($queryCheck);
        $stmtCheck->execute([
            'usuarioLigaID' => $usuarioLigaID,
            'jugadorID' => $jugadorID,
        ]);

        if ($stmtCheck->fetch()) {
            throw new Exception("El jugador ya pertenece a la plantilla o reserva.");
        }

        // Agregar el jugador a la reserva
        $queryInsert = "INSERT INTO Plantillas (UsuarioLigaID, JugadorID, Estado) 
                        VALUES (:usuarioLigaID, :jugadorID, 'RESERVADO')";
        $stmtInsert = $pdo->prepare($queryInsert);
        $stmtInsert->execute([
            'usuarioLigaID' => $usuarioLigaID,
            'jugadorID' => $jugadorID,
        ]);

        echo "Jugador agregado correctamente a la reserva.";
    } catch (Exception $e) {
        die("Error: " . $e->getMessage());
    }
}

include 'plantilla.php';

