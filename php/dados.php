<?php
$host = "localhost:3306";
$user = "doctorap_root";
$pass = "piwdiC-humkak-padto5";
$db = "doctorap_demo_vi";

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8");

if ($conn->connect_error) {
	die("Erro de conexão: " . $conn->connect_error);
}

$sql = "SELECT namesong AS namesong, artist, typesong, lyricsong, national FROM music";
$result = $conn->query($sql);

$dados = [];

if ($result->num_rows > 0) {
	while ($row = $result->fetch_assoc()) {
		$dados[] = $row;
	}
}

header('Content-Type: application/json');
echo json_encode($dados);
$conn->close();
?>
