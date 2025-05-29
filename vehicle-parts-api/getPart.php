<?php
header("Access-Control-Allow-Origin: *");
include 'db.php';

// Fetch params, use null if not provided
$make = isset($_GET['make']) ? $_GET['make'] : null;
$model = isset($_GET['model']) ? $_GET['model'] : null;
$type = isset($_GET['type']) ? $_GET['type'] : null;

// Base query
$sql = "SELECT partno, make, model, type FROM parts";

// Build WHERE conditions dynamically
$conditions = [];
$params = [];
$types = "";

// Add conditions if parameters are provided
if ($make) {
  $conditions[] = "make = ?";
  $params[] = $make;
  $types .= "s";
}

if ($model) {
  $conditions[] = "model = ?";
  $params[] = $model;
  $types .= "s";
}

if ($type) {
  $conditions[] = "type = ?";
  $params[] = $type;
  $types .= "s";
}

// Add WHERE clause if any conditions exist
if (!empty($conditions)) {
  $sql .= " WHERE " . implode(" AND ", $conditions);
}

$stmt = $conn->prepare($sql);

// Bind parameters if any exist
if (!empty($params)) {
  $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$partnos = [];
while($row = $result->fetch_assoc()) {
  $partnos[] = [
    'make' => $row['make'],
    'model' => $row['model'],
    'type' => $row['type'],
    'part' => $row['partno']
  ];
}

header('Content-Type: application/json');
echo json_encode($partnos);
?>
