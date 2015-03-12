<?php
	$karaoke = $_POST['karaoke'];
    file_put_contents('isKaraoke.json', $karaoke);
    echo 'Karaoke is now ' . $karaoke;
    echo '<meta http-equiv="refresh" content="2;url=index.html" />';
?>