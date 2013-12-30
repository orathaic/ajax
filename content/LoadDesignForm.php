<?php

class LoadDesignForm extends content
{

 function __construct($Game)
 {
	parent::__construct(get_class($this), $Game);
	$this->Main = 'LoadDesignForm';
	return;
 }
 
 function __toString()
 {
	$LoadDesignNode = new htmlphp('div','ReplaceContent','Design');
	$LoadDesignNode->addattr('id','LoadDesignFormContainer');//->addattr('class','hidden');
//	$LoadDesignNode = new htmlphp('div','content','LoadDesignFormContainer');
	$LoadDesignNode->addchild('div')->addattr('class','CloseButton')->addtext('X');
	$LoadDesignNode->addchild('div')->addattr('class','ReloadButton')->addtext('↻');
	$LoadDesignForm = &	$LoadDesignNode->addchild('form');
	$LoadDesignForm->addattr('class','bgbox')->addattr('id','LoadDesignForm')->addtext("User: {$this->Game->Account->GetUsername()} ")->linebreak();
	$SelectNode = & $LoadDesignForm->addtext('Select Design ')->addchild('select')->addattr('id','DesignName')->addattr('name','DesignName');

	$Option = $this->Game->GetDesignList();
	
	foreach($Option as $key => $value)
	{$SelectNode->addchild('option')->addattr('value',$key)->addtext($value);} // key to identify in html without the limits of ID use.
	$LoadDesignForm->linebreak()->addchild('input')->addattr('type','button')->addattr('id','LoadDesign')->addattr('value','Load Design');
	$LoadDesignForm->addchild('input')->addattr('type','button')->addattr('id','ShowDesignDetails')->addattr('value','Show Details');

	// thinking about doing some design comparison stuff in tables here!!!
	$DescriptionNode = & $LoadDesignForm->addchild('div');
	$DescriptionNode->addattr('id','DescContainer')->addattr('class','hidden')->addchild('div')->addattr('class','CloseButton')->addtext('X');
	$DescriptionNode->addchild('input')->addattr('type','button')->addattr('value','edit')->addattr('class','EditButton')->addattr('id','EditDescription');
	$DescriptionNode->linebreak()->linebreak();

	foreach($Option as $key => $value)
	{
		$Desc = $this->Game->GetDesignDesc($value); if($Desc == '') $Desc = 'No description available.'; // default value
		$DescriptionNode->addchild('div')->addattr('class','hidden DesignDesc')->addattr('id',$key."Desc")->addtext($Desc); // key to avoid name conflicts with html ID limits.
	}

	return "[$LoadDesignNode]";
 }
}
?>
