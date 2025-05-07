<?php
require_once 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    $stmt = $pdo->prepare("SELECT ID, PASSWORD_HASH FROM USER WHERE USERNAME = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['PASSWORD_HASH'])) {
        session_start();
        $_SESSION['user_id'] = $user['ID'];
        echo "Login successful.";
    } else {
        http_response_code(401);
        echo "Invalid username or password.";
    }
}
?>
