<?php
session_start();
require_once './settings/game.info.php';

class content
{
 function __construct()
 {
	$this->Main = 'Default contents';
	$this->Game = new Colonywars();
	return;
 }
 function __toString()
 {
	// page know how to display content, so there should be no html/css here.
	// format - id to update, content to place -> id,content
	// Send JSON down, page can parse and add to DOM, or eval JS
	 $tag =	'{"tn":"div",
		"attr":{"id":"'.get_class($this).'", "class":"content bgbox"}, 
		"children": [{"tn":"text","text":"Error: tab - "},'.$this->GetMain().',{"tn":"text","text":"Should not be displayed, please ignore this issue."}]
		}';
	return "[$tag]";
//	return "<div class='content bgbox' id=".get_class($this)."> Error: tab - ".$_GET['tab'].$this->GetMain()." Should not be displayed, please ignore this issue.</div>";
 }

 function GetMain()
 {	//return 0;
	return '{"tn":"div","attr":{"class":"title"},"children":[{"tn":"text","text":"'.$_GET['tab']." ".$this->main.'"}]}';
//	return "<div class=title>$this->main</div>";
 }
}

require_once './settings/game.info.php';
$Game = new Colonywars(); 
if($Game->Account->GetUsername() == '')
 {echo $Game->AskForLogin(); echo '</div>'; exit();}

if(isset($_GET['tab']))
 {  
	@include_once "./content/".$_GET['tab'].".php";

	switch($_GET['return'])
	{
		case "html": if(class_exists($_GET['tab']) && method_exists($_GET['tab'], 'toHtml')) 
		{$LoadDesign = new $_GET['tab']; $ToReturn = $LoadDesign->toHtml();}
		else $ToReturn = "<div class='CloseButton'>X</div><div class=error><br /> No html method found, or class !exists</div>";
		break;

		case "json": // fall through
		default:		

		if(class_exists($_GET['tab']))
		$ToReturn = new $_GET['tab']();  
		else 
		$ToReturn = new content(); 
		break;
	}
	echo $ToReturn;
 }
?>
