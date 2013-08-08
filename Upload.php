<?php
require_once './settings/game.info.php';
session_start();
$Game = new Colonywars(); 
if($Game->Account->GetUsername() == '')
 {//echo $Game->AskForLogin(); echo '</div>';
											 exit();}
else if(isset($_GET['json']))
{
/**
CREATE  TABLE IF NOT EXISTS cw_ship_design 
(
id INT NOT NULL AUTO_INCREMENT,
PRIMARY KEY(id),
Username CHAR(20),
DesignName CHAR(20),
DesignJSON VARCHAR(65484)
)
**/
echo $Game->SaveShipDesign($_GET['json'],$_GET['name']);	
}

?>
