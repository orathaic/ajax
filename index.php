<?php
session_start();
// this page should handle and direct a request, and then construct the responce.
//two functions -> get request, format reply 

/* pseudo code
* - auth class
* - content handling class/db actions
* - return values (success/fail, phphtml/json)
* 
*/

require_once './settings/game.info.php';

$Game = new Colonywars(); 

if($Game->Account->GetUsername() == '')
	{ $Content = $Game->AskForLogin($Game->note); }
else if(isset($_POST['tab']) )
	{ $Content = $Game->GetContent($_POST['tab']);}
else if(isset($_POST['SaveShipDesign']) && $_POST['SaveShipDesign'] == true)
	{ if(isset($_POST['json']) && isset($_POST['name']) ) echo $Game->SaveShipDesign($_POST['json'],$_POST['name']); return;}
else
	{ if(isset($_POST['ajax']) && $_POST['ajax'] == 'true' ) {$Content = 'null';} else {$Content = $Game->GetContent('SpacePort');}
	}// Default??

echo $Game->SendReturn($Content);
/*
$arr = array_merge(array('BLANK1' => 'POST'), $_POST,array('BLANK2' => 'get'), $_GET,array('BLANK3' => 'session'), $_SESSION,array('BLANK4' => 'server'), $_SERVER,array('BLANK5' => 'apache request headers'), apache_request_headers());
foreach( $arr  as $key => $value) {$toRet .= "$key - $value <br />";}  */
//echo $toRet;
?>
