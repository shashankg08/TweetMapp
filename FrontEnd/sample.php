<?php

	echo "Hello World!";

	if (!function_exists('mysqli_init') && !extension_loaded('mysqli')) {
    	echo 'We don\'t have mysqli!!!';
	} 
else {
    echo 'Phew we have it!';
	}

?>