<?php
try {
    $queryJugadores = "SELECT * 
        FROM historial_jugadores_liga hj
        JOIN jugadores j ON hj.JugadorID = j.JugadorID
        JOIN usuarios_ligas ul ON hj.UsuarioLigaID = ul.UsuarioLigaID
        WHERE ul.UsuarioID = ? AND ul.LigaID = ? AND hj.Jornada = ?";
    $queryTodosJugadores = "SELECT * FROM jugadores";   


    $stmtJugadores = $pdo->prepare($queryJugadores);
    $stmtTodosJugadores = $pdo->query($queryTodosJugadores);



    // Ejecutar la consulta con los parámetros
    $stmtJugadores->execute([$usuarioID, $ligaID, $_POST['jornada']]);

    // Obtener los resultados
    $jugadores = $stmtJugadores->fetchAll(PDO::FETCH_ASSOC);
    $todos = $stmtTodosJugadores->fetchAll(PDO::FETCH_ASSOC);

    $JugadoresIDs = array_column($jugadores, 'JugadorID');

    print_r($JugadoresIDs);

} catch (PDOException $e) {
    die("Error al ejecutar las consultas: " . $e->getMessage());
}
?>
<form action="controlador.php" method="post">
    <table>
        <tr>
            <td>Jugador</td>
        </tr>
        <?php
        for ($i = 0; $i < 3; $i++):
            $jugadorSeleccionado = $JugadoresIDs[$i] ?? null;
            ?>
            <tr>

                <td>
                    <select name="jugador[]" id="">
                        <option value="jugador">Selecciona jugador</option>
                    <?php foreach ($todos as $jugador): 
                        
                        ?>

                        
                        <option value="<?php echo $jugador['JugadorID']?>" <?php if ($jugador['JugadorID'] == $jugadorSeleccionado) echo 'selected'?>><?php echo $jugador['Nombre']?></option>


                        <?php endforeach; ?>
                    </select>

                </td>
            </tr>




            <?php

        endfor;

        ?>
    </table>
    <input type="hidden" name="jornada" value="<?php echo $_POST['jornada'] ?>">
    <input type="hidden" name="userid" value="<?php echo $usuarioID ?>">
    <input type="hidden" name="ligaid" value="<?php echo $ligaID ?>">
    <input type="submit" value="Guardar">
</form>