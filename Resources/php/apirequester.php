<?php
    error_reporting(E_ALL); // Errors on
    ini_set('display_errors', 1);
        
    header('Content-type: application/xml'); // Set data type

    $username = 'cmanders.tech';
    $password = 'a47325f0e9d8a877576edd687fa1a7b4';
    $url = 'https://cloudops-jenkins-ust1.hostedtest.act.com:8443/me/api/xml'; // Set url with group id and field selection from URL string
    
    $context = stream_context_create(array( // Authorise basic
        'http' => array(
            'header'  => "Authorization: Basic " . base64_encode("$username:$password")
        )
    ));

    $data = file_get_contents($url, false, $context); // Get the contents of the URL
    
    echo $data; // Show the returned data
?>