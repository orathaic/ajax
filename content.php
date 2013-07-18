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
	// Send JSON down, page can parse and add to DOM, or eval JS
	return 'node = {"tn":"div",
		"attr":{"id":"'.get_class($this).'", "class":"content bgbox"}, 
		"children": [{"tn":"text","text":"Error: tab - "},'.$this->GetMain().',{"tn":"text","text":"Should not be displayed, please ignore this issue."}]
		}';
//	return "<div class='content bgbox' id=".get_class($this)."> Error: tab - ".$_GET['tab'].$this->GetMain()." Should not be displayed, please ignore this issue.</div>";
 }

 function GetMain()
 {	//return 0;
	return '{"tn":"div","attr":{"class":"title"},"children":[{"tn":"text","text":"'.$_GET['tab'].$this->main.'"}]}';
//	return "<div class=title>$this->main</div>";
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
