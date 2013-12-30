<?php

class LoadDesign extends content
{

 function __construct($Game)
 {
	parent::__construct(get_class($this), $Game);
	$this->Main = 'LoadDesign';
	return;
 }
 
 function __toString()
 {
	if(isset($_POST['DesignName'])) {
	$DesignJSON = $this->Game->GetDesignJSON($_POST['DesignName']);
	return "[$DesignJSON]"; } else die();
 }

}
?>
