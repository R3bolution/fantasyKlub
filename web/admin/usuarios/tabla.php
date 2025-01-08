<?php
if (!isset($_SESSION['usuario'])) {
    header("Location: ../login.php");
    exit;
}

include '../../conection.php';

$query = "SELECT * FROM usuarios";

try {
    $stmt = $pdo->query($query);
    $usuarios = $stmt->fetchAll(PDO::FETCH_ASSOC);


} catch (PDOException $e) {
    die("Error al ejecutar la consulta: " . $e->getMessage());
}
?>
<table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Fecha Registro</th>
                <th>Ultimo Acceso</th>
                <th>Estado</th>
                <th>Accion</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($usuarios as $usuario): ?>
                <tr>
                    <td><?php echo $usuario['UsuarioID']; ?></td>
                    <td><?php echo $usuario['Nombre']; ?></td>
                    <td><?php echo $usuario['Correo']; ?></td>
                    <td><?php echo $usuario['FechaRegistro']; ?></td>
                    <td><?php echo $usuario['UltimoAcceso']; ?></td>
                    <td><?php echo $usuario['Estado']; ?></td>
                    <td>
                        <a href="editar.php?id=<?php echo $usuario['UsuarioID']; ?>">Editar</a>
                        <a href="eliminar.php?id=<?php echo $usuario['UsuarioID']; ?>">Eliminar</a>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>