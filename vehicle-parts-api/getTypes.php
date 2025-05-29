<?php
//Set origin to allow HTTP requests from
header("Access-Control-Allow-Origin: *");

//Establish connection with DB
include 'db.php';

// Fetch params from the request URL, use null if not provided
$make = isset($_GET['make']) ? $_GET['make'] : null;
$model = isset($_GET['model']) ? $_GET['model'] : null;

$sql = "SELECT DISTINCT type FROM parts";

// Build WHERE conditions dynamically based on params provided
$conditions = [];
$params = [];
$types = "";

// Add conditions if parameters are provided
if ($make) {
  $conditions[] = "make = ?";
  $params[] = $make;
  $types .= "s";
}

// Add string parameters based on no. of params
if ($model) {
  $conditions[] = "model = ?";
  $params[] = $model;
  $types .= "s";
}

// Add WHERE clause if any conditions exist
if (!empty($conditions)) {
  $sql .= " WHERE " . implode(" AND ", $conditions);
}

//Prepared statement
$stmt = $conn->prepare($sql);

// Bind parameters if any exist
if (!empty($params)) {
  $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

//Empty array to store the retrieved types
$types = array();

//Fetch every row from the resukt and append to the array
while($row = $result->fetch_assoc()) {
  $types[] = $row['type'];
}

//Inform about the response type to the client
header('Content-Type: application/json');
//Encode in json format
echo json_encode($types);
?>

