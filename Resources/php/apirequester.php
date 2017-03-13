<?php
    error_reporting(E_ALL); // Errors on
    ini_set('display_errors', 1);
        
    header('Content-type: text/xml'); // Set data type

    $url = $_GET["url"];
    $token = $_GET["token"];
    
    $context = stream_context_create(array( // Authorise basic
        'http' => array(
            'header'  => "Authorization: " . $token
        )
    ));

    $data = file_get_contents($url, false, $context); // Get the contents of the URL

    if (strpos($data, "enabledColorBlindSupport")){
        echo $data; // Show the returned data
    }
    else {
        http_response_code(401);
    }
?>