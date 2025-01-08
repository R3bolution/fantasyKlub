<?php

$query="SELECT * 
FROM usuarios
WHERE NOT EXISTS (
    SELECT 1
    FROM usuarios_ligas 
    WHERE usuarios_ligas.usuarioID = usuarios.usuarioID
    AND usuarios_ligas.ligaID = {$_POST['id']}
);";

try {
    $stmt = $pdo->query($query);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);


} catch (PDOException $e) {
    die("Error al ejecutar la consulta: " . $e->getMessage());
}
?>
<form action="anadir.php" method="post">
    <input type="hidden" name="id" value="<?php echo $_POST['id']; ?>">
    <select name="user" id="user">
        <?php foreach ($users as $user) {
            echo "<option value='{$user['UsuarioID']}'>{$user['Nombre']}</option>";
        } ?>
    </select>
    <input type="submit" value="Agregar">
</form>