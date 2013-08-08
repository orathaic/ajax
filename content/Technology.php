<?php

class Technology extends content
{

 function __construct()
 {
	parent::__construct();
	$this->Main = 'Tech - Canvas test';
	return;
 }
 
 function __toString()
 {
	$Node = new htmlphp('div');
	$Node->addattr('class','content hidden bgbox')->addattr('id',get_class($this))->addchild('span')->addattr('id','TechHeader')->addtext("HEADER");
	$Node->addchild("br");
	$Node->addchild("div")->addattr("id","Research")->addattr("class","hidden")->addtext("This is a stub for the research tab.");
	$DesignNode = &$Node->addchild('div')->addattr("id","Design");
    $DesignNode->addchild('input')->addattr('type','button')->addattr('id',"NewShip")->addattr("value","New");
	$DesignNode->addchild('input')->addattr('type','button')->addattr('id',"OpenLoadDesignForm")->addattr("value","Load");
	$DesignNode->addchild('input')->addattr('type','button')->addattr('id',"Save")->addattr("value","Save");
	$DesignNode->addchild('div')->addattr('class','Right HelpText')->addattr('id','DesignHelp')->addtext('?');
	$TestDesignSpan = &$DesignNode->addchild('span')->addattr('class','Right hidden')->addattr('id','DesignTesting');
	$TestDesignSpan->addchild('input')->addattr('type','button')->addattr('id',"EnergyDisplay")->addattr("value","Show Energy");
	$TestDesignSpan->addchild('input')->addattr('type','button')->addattr('id',"O2Display")->addattr("value","Show O2");
	$TestDesignSpan->addchild('input')->addattr('type','button')->addattr('id',"HeatDisplay")->addattr("value","Show Heat");
	$TestDesignSpan->addchild('input')->addattr('type','button')->addattr('id',"TestDesign")->addattr("value","Test Design");

	$LoadDesignForm = &$DesignNode->addchild("div")->addattr("id","LoadDesignFormContainer")->addattr("class","hidden");

	$HelperTextContainerNode = &$DesignNode->addchild("div")->addattr("id","HelperTextContainer")->addattr("class","hidden");
	$HelperTextContainerNode->addchild("div")->addtext("X")->addattr("class","CloseButton");
	$HelperTextNode = &$HelperTextContainerNode->addchild("div")->addattr("id","HelperText");
	$HelperTextNode->addtext("Ship design: Ships are made up of three types of components: Hull ")->addchild('img')->addattr('src','./pix/Hull.png');
	$HelperTextNode->addtext(', Corridor ')->addchild('img')->addattr('src','./pix/Room.png');
	$HelperTextNode->addtext(', and Systems ')->addchild('img')->addattr('src','./pix/System.png');
	$HelperTextNode->addtext(', ')->addchild('img')->addattr('src','./pix/PowerSupply.png');
	$HelperTextNode->addtext(', ')->addchild('img')->addattr('src','./pix/OxygenGen.png');


	$HelperTextNode->addchild('p')->addtext("Each component has it's own O2, Heat and Energy value, these will flow into the neighbouring components (4 nearest neighbours only - 6 in 3d)");
	$HelperTextNode->linebreak()->addtext("Some components are better at allowing this flow. Corridors for O2, Hull for Heat and Energy.");
	$HelperTextNode->linebreak()->addtext("Be");

	$DesignNode->addchild("br");
	$ColumnleftNode = &$DesignNode->addchild("div")->addattr("id","columnleft");
	$ColumnleftNode->addchild('div')->addattr("class","DesignUnit Dragable Hull")->addattr("id","Hull")->addattr("draggable","false");
	$ColumnleftNode->addchild('div')->addattr("class","DesignUnit Dragable Room")->addattr("id","Room")->addattr("draggable","false");
	$ColumnleftNode->addchild('div')->addattr("class","DesignUnit Dragable System")->addattr("id","System")->addattr("draggable","false");
	$ColumnleftNode->addchild('div')->addattr("class","DesignUnit Dragable OxygenGen")->addattr("id","OxygenGen")->addattr("draggable","false");
	$ColumnleftNode->addchild('div')->addattr("class","DesignUnit Dragable PowerSupply")->addattr("id","PowerSupply")->addattr("draggable","false");

	$DesignNode->addchild("div")->addattr("class","hidden")->addattr("id","SimData");
	$DesignNode->addchild("div")->addattr("class","DropTarget")->addattr("id","DesignCanvas");

	$DesignBgDiv =	&$DesignNode->addchild("div")->addattr("id","NewDesignForm")->addattr("class","hidden");
	$DesignBgDiv->addchild("div")->addtext("X")->addattr("class","CloseButton");
	$NewShipForm =	&$DesignBgDiv->addchild("form")->addattr("class","bgbox")->addattr("id","NewShipForm");
	$NewShipForm->addtext('Design Name: ')->addchild('input')->addattr('type','text')->addattr('id','DesignNameText')->addattr('value','...')->addattr('maxlength','20')->addattr('class','TextInput');
	$NewShipForm->addchild('br');
	$ShipClassSelector = &$NewShipForm->addtext('Ship Class: ')->addchild('select')->addattr('disabled','');
    $ShipClassSelector->addchild('option')->addattr('value','Civilian')->addtext('Civilian');
    $ShipClassSelector->addchild('option')->addattr('value','Military')->addtext('Military');
    $ShipClassSelector->addchild('option')->addattr('value','Unaffiliated')->addtext('Unaffiliated');
	$NewShipForm->addchild('br');
	$NewShipForm->addchild('br');
	$NewShipForm->addchild('br');
	$NewShipForm->addchild('input')->addattr('type','button')->addattr('value','Create New Design')->addattr('id','SubmitDesignName');

$jsString = file_get_contents('./js/TechDesign.js');
if($jsString)
{
//	$jsString = str_replace('"',"'",$jsString);
	$Script = new htmlphp('script');
	$Script->addattr('js', $jsString);
}
//$Script = str_replace('\t','',$Script);
//$Script = str_replace('\n','',$Script);
	return "[$Node,$Script]";
//echo $jsString;
 }
}

?>
