<?php
session_start();
require_once './settings/game.info.php';

class content
{
 function __construct()
 {
	$this->main = 'Default contents';
	$this->game = new Colonywars();
	return;
 }
 function __toString()
 {
	// page know how to display content, so there should be no html/css here.
	// format - id to update, content to place -> id,content
	return "<div class='content bgbox' id=".get_class($this)."> Error: tab - ".$_GET['tab'].$this->GetMain()." Should not be displayed, please ignore this issue.</div>";
//:<div class='content' id=".get_class($this).">content : $this->main</div>"; 
 }

 function GetMain()
 {
	return "<div class=title>$this->main</div>";
 }
}

if(isset($_GET['tab']))
 {  
	@include_once "./content/".$_GET['tab'].".php";
	if(class_exists($_GET['tab']))
	$ToReturn = new $_GET['tab']();  
	else 
	$ToReturn = new content(); 
	echo $ToReturn;
 }




?>
