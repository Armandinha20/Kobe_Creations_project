<?php
header("Access-Control-Allow-Origin: *");
include 'db.php';

$make = $_GET['make'];

$sql = "SELECT DISTINCT model FROM parts WHERE make = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $make);
$stmt->execute();
$result = $stmt->get_result();

$models = array();
while($row = $result->fetch_assoc()) {
  $models[] = $row['model'];
}

header('Content-Type: application/json');
echo json_encode($models);
?>
