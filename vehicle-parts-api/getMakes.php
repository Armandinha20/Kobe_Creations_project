<?php
header("Access-Control-Allow-Origin: *");
include 'db.php';

$sql = "SELECT DISTINCT make FROM parts";
//execute query for the sql statement
$result = $conn->query($sql);

//empty array for makes
$makes = array();
//fetch every row and append to the array
while($row = $result->fetch_assoc()) {
  $makes[] = $row['make'];
}

////Inform about the response type to the client
header('Content-Type: application/json');
//Encode in json format
echo json_encode($makes);
?>

