<?php
$host = "localhost:3306";
$user = "doctorap_root";
$pass = "piwdiC-humkak-padto5";
$db = "doctorap_demo_vi";


$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
	die("❌ Erro na conexão: " . $conn->connect_error);
} 

echo "✅ Conexão bem-sucedida!";
?>

