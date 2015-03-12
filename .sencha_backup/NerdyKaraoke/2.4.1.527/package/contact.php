<?php

	$to = "requests@nerdykaraoke.com"; // this is your Email address
    $from = $_POST['email']; // this is the sender's Email address
    $name = $_POST['name'];
    $artist = $_POST['artist'];
    $title = $_POST['title'];
    $subject = "Request: " . $artist . " - " . $title;
    $message = $name . " requested the following:" . "\n\n" . $title . " by " . $artist;

    $headers = "From:" . $from . "\r\n" .
    			"Reply-To:" . $from;
    mail($to,$subject,$message,$headers);

?>