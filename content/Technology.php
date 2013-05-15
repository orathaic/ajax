<?php

class Technology extends content
{

 function __construct()
 {
	parent::__construct();
	$this->main = 'Tech - Canvas test';
	return;
 }
 
 function __toString()
 {
	return "<div class='content hidden bgbox' id=".get_class($this).">Technology >  <input type=button value=Research> <input type=button value=Design><br />
<div class='hidden' id='Research'>This is a stub for the research tab.</div> 

<div class='hidden' id='Design'>This is a stub for the Design canvas-tab. <canvas id='DesignCanvas'>Your browser does not support the canvas element.</canvas> </div>".
	
"</div>"; 
 }
}


?>
