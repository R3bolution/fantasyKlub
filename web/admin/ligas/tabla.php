<?php
if (!isset($_SESSION['usuario'])) {
    header("Location: ../login.php");
    exit;
}

include '../../conection.php';

$query = "SELECT l.LigaID,l.Nombre,COUNT(*) AS 'usuarios' FROM Ligas l
JOIN usuarios_ligas ul ON l.LigaID=ul.LigaID
GROUP BY l.LigaID";

try {
    $stmt = $pdo->query($query);
    $ligas = $stmt->fetchAll(PDO::FETCH_ASSOC);


} catch (PDOException $e) {
    die("Error al ejecutar la consulta: " . $e->getMessage());
}

?>
<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Usuarios</th>
            <th>Accion</th>
        </tr>
    </thead>
    <tbody>
        <?php foreach ($ligas as $liga): ?>
            <tr>
                <td><?php echo $liga['LigaID']; ?></td>
                <td><?php echo $liga['Nombre']; ?></td>
                <td><?php echo $liga['usuarios']; ?>/5</td>
                <td>
                    <form action="editar/editar.php" method="post" style="display: inline;">
                        <input type="hidden" name="id" value="<?php echo $liga['LigaID']; ?>">
                        <button type="submit">Editar</button>
                    </form>
                    <a href="eliminar.php?id=<?php echo $liga['LigaID']; ?>">Eliminar</a>
                </td>
            </tr>
        <?php endforeach; ?>
    </tbody>
</table>
