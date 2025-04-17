<?php
include "conexao.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$namesong = $_POST["namesong"];
	$typesong = $_POST["typesong"];
	$lyricsong = $_POST["lyricsong"];

	if (!empty($namesong) && !empty($typesong) && !empty($lyricsong)) {
		// Obter os nomes correspondentes
		$query_musica = "SELECT nome FROM musicas WHERE id = ?";
		$query_tipo = "SELECT tipo FROM tipos_musicais WHERE id = ?";

		$stmt1 = $conn->prepare($query_musica);
		$stmt1->bind_param("i", $namesong);
		$stmt1->execute();
		$result1 = $stmt1->get_result();
		$musica = $result1->fetch_assoc()["nome"];

		$stmt2 = $conn->prepare($query_tipo);
		$stmt2->bind_param("i", $typesong);
		$stmt2->execute();
		$result2 = $stmt2->get_result();
		$tipo = $result2->fetch_assoc()["tipo"];

		// Exibir os dados
		echo "<h2>Dados enviados:</h2>";
		echo "Música selecionada: " . htmlspecialchars($musica) . "<br>";
		echo "Tipo musical: " . htmlspecialchars($tipo) . "<br>";
		echo "Trecho da música: " . nl2br(htmlspecialchars($lyricsong)) . "<br>";
	} else {
		echo "Por favor, preencha todos os campos!";
	}
}

$conn->close();
?>
