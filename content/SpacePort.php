<?php

class SpacePort extends content
{

 function __construct()
 {
	parent::__construct();
	$this->main = 'Welcome to the City Space Port';
	return;
 }
  function __toString()
 {
	return "<div class='content bgbox' id=".get_class($this).">".$this->GetMain()."</div>"; 
 }
}


?>
