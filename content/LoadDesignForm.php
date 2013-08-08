<?php

class LoadDesignForm extends content
{

 function __construct()
 {
	parent::__construct();
	$this->Main = 'LoadDesignForm';
	return;
 }
 
 function __toString()
 {
	$Node = new htmlphp('div');
	$Node->addtext('This Node should not be displayed. Please report this #FGED45');
	return "[$Node]";
 }

 function toHtml()
 {
	$Option = $this->Game->GetDesignList();	
	
	$ToReturn = "<div class='CloseButton'>X</div><div class='ReloadButton'>&#x21bb;</div>
	<form class='bgbox' id='LoadDesignForm'>
	User: {$this->Game->Account->GetUsername()} <br />	
	Select Design <select name=DesignName>"; 
	foreach($Option as $key => $value)
	{$ToReturn .= "<option>{$value}</option>";}
	$ToReturn .=	"</select> <br />
	<input type='button' id='LoadDesign' value='Load Design'> <input type='button' value='Show Details'>
	</form>";  // thinking about doing some design comparison stuff in tables here!!!
	return $ToReturn; 
 }

}
?>
