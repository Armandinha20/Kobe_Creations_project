<?php
header("Access-Control-Allow-Origin: *");
include 'db.php';

$sql = "SELECT DISTINCT make FROM parts";
$result = $conn->query($sql);

$makes = array();
while($row = $result->fetch_assoc()) {
  $makes[] = $row['make'];
}

header('Content-Type: application/json');
echo json_encode($makes);
?>

