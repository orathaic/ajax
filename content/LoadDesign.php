<?php

class LoadDesign extends content
{

 function __construct()
 {
	parent::__construct();
	$this->Main = 'LoadDesign';
	return;
 }
 
 function __toString()
 {
	if(isset($_GET['DesignName'])) {
	$DesignJSON = $this->Game->GetDesignJSON($_GET['DesignName']);
	return "[$DesignJSON]"; } else die();
 }

}
?>
