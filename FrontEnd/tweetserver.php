<?php


// Create connection
// catch post request and process
// remove spaces if any

//switch db as per incoming request.
if ($_POST['method'] == 'facup'){
	include 'db_connect_2.php';			// non-facup db
	$mydatabase = 'MUFC';
}

else{
	include 'db_connect.php';
	$mydatabase = 'tweetbase';
	
}


$tag = str_replace(' ', '', $_POST['tag']);
$tag = str_replace('#', '', $_POST['tag']);

if ($tag == 'GoBazinga!'){
	$tag = '';
}

//$tag = "snow";
//$mydatabase = 'tweetbase';

$conn = new mysqli($db_url, $user, $pass, $mydatabase, 3306);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//SELECT * from tweetbase where tweet LIKE '%".$tag."%'		
$charset = mysqli_query($conn,"SET CHARACTER SET utf8");		// setting utf-8

$mysql = mysqli_query($conn, "SELECT * from tweetbase where tweet LIKE '%".$tag."%'");	//OR user_handle LIKE '%".$tag."%'");

while($row = mysqli_fetch_array($mysql)) {		// add count here to limit number of tweets.

	$a = array("username" => $row['user_handle'], "tweet" => $row['tweet'], "lat" => $row['lattitude'], "longi" => $row['longitude'], "tweet_date" => $row['tweet_date']);
	// create sql array;
	if (empty($sql_array)){
		$sql_array = array($a);
	}
	// populate sql query results.
	else{
		array_push($sql_array, $a);
	}

}
// sql_array has to be sent to google maps via ajax.
//$sql_array['json'] = json_encode($sql_array);			
echo json_encode($sql_array);

mysqli_close($conn);

?>