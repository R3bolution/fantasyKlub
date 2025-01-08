<?php

include '../../plantillas/header.php';
include '../../../conection.php';

$queryLiga = "SELECT * FROM ligas WHERE ligaID={$_GET['id']};";

$queryUsuarios = "SELECT u.UsuarioID,u.Nombre FROM usuarios_ligas ul
                    JOIN usuarios u ON ul.UsuarioID=u.UsuarioID
                    WHERE ul.ligaID={$_GET['id']};";

try {
    $stmtLiga = $pdo->query($queryLiga);
    $liga = $stmtLiga->fetchAll(PDO::FETCH_ASSOC);

    $stmtUsers = $pdo->query($queryUsuarios);
    $users = $stmtUsers->fetchAll(PDO::FETCH_ASSOC);

} catch (PDOException $e) {
    die("Error al ejecutar la consulta: " . $e->getMessage());
}
?>
<h2>Editar Liga</h2>
<h3><?php echo $liga['0']['Nombre'] ?></h3>

<table>
    <thead>
        <tr>
            <th>Nombre</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>


        <?php foreach ($users as $user): ?>
            <tr>
                <td><?php echo $user['Nombre']; ?></td>
                <td>
                    <form action="sacar.php" method="post" style="display: inline;">
                        <input type="hidden" name="userid" value="<?php echo $user['UsuarioID']; ?>">
                        <input type="hidden" name="ligaid" value="<?php echo $_GET['id']; ?>">
                        <button type="submit">Sacar</button>
                    </form>
            </tr>
        <?php endforeach; ?>

    </tbody>
</table>

<?php

include 'listarUsers.php';

include '../../plantillas/footer.php';