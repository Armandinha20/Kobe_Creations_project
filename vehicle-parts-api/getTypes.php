<?php
header("Access-Control-Allow-Origin: *");
include 'db.php';

// Fetch parameters; set to null if not provided
$make = isset($_GET['make']) ? $_GET['make'] : null;
$model = isset($_GET['model']) ? $_GET['model'] : null;

// Base SQL query
$sql = "SELECT DISTINCT type FROM parts";

// Build WHERE clause dynamically
$conditions = [];
$params = [];
$types = "";

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

if (!empty($conditions)) {
    $sql .= " WHERE " . implode(" AND ", $conditions);
}

$stmt = $conn->prepare($sql);

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$typesArr = [];
while ($row = $result->fetch_assoc()) {
    $typesArr[] = $row['type'];
}

header('Content-Type: application/json');
echo json_encode($typesArr);
?>
