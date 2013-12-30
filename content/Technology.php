<?php

class Technology extends content
{

 function __construct($Game)
 {
	parent::__construct(get_class($this),$Game);
	$this->Main = 'Tech - Canvas test';
	return;
 }
 
 function __toString()
 {
	$Node = new htmlphp('div','content','PageContainer');
	$Node->addattr('class','content hidden bgbox')->addattr('id',get_class($this))->addchild('span')->addattr('id','TechHeader')->addtext("Tech - Designs");
	$Node->addchild('span')->addattr('id','NameHeader')->addattr('type','text');
	$Node->addchild('span')->addattr('id','ZedIndexHeader')->addattr('type','text');
	$Node->addchild("br");
	$Node->addchild("div")->addattr("id","Research")->addattr("class","hidden")->addtext("This is a stub for the research tab.");
	$DesignNode = &$Node->addchild('div')->addattr("id","Design");
    $DesignNode->addchild('input')->addattr('type','button')->addattr('id',"NewShip")->addattr("value","New");
	$DesignNode->addchild('input')->addattr('type','button')->addattr('id',"OpenLoadDesignForm")->addattr("value","Load");
	$DesignNode->addchild('input')->addattr('type','button')->addattr('id',"Save")->addattr("value","Save");
	$DesignNode->addchild('input')->addattr('type','button')->addattr('class','Right HelpText')->addattr('id','DesignHelp')->addattr('value','?');

	$DesignNode->addchild('input')->addattr('class','Right')->addattr('type','button')->addattr('id',"EditDesign")->addattr("value","Edit Design");

	$DesignManageSpan = &$DesignNode->addchild('span')->addattr('class','Right')->addattr('id','DesignManager');
	$DesignManageSpan->addchild('input')->addattr('type','button')->addattr('id',"RenameDesign")->addattr("value","Rename");
	$DesignManageSpan->addchild('input')->addattr('type','button')->addattr('id','CombatTest')->addattr('value','Combat Test');
	$DesignManageSpan->addchild('input')->addattr('type','button')->addattr('id',"OpenShareDesign")->addattr("value","Share")->addattr("onclick","alert('Todo: implement design sharing')");


	$TestDesignSpan = &$DesignNode->addchild('span')->addattr('class','Right hidden')->addattr('id','DesignTesting');
	$TestDesignSpan->addchild('input')->addattr('type','button')->addattr('id',"EnergyDisplay")->addattr("value","Show Energy");
	$TestDesignSpan->addchild('input')->addattr('type','button')->addattr('id',"O2Display")->addattr("value","Show O2");
	$TestDesignSpan->addchild('input')->addattr('type','button')->addattr('id',"HeatDisplay")->addattr("value","Show Heat");
	$TestDesignSpan->addchild('input')->addattr('type','button')->addattr('id',"TestDesign")->addattr("value","Test Design");
	$TestDesignSpan->addchild('div')->addattr('id',"ZIndexPlus")->addtext("+");
	$TestDesignSpan->addchild('div')->addattr('id',"ZIndexMinus")->addtext("‒");
	$TestDesignSpan->addchild('img')->addattr('id',"XYpan")->addattr("src","./pix/pan.png");


//	$LoadDesignForm = &$DesignNode->addchild("div")->addattr("id","LoadDesignFormContainer")->addattr("class","hidden"); <- now added by the design form button
	$CombatTestContainer = &$DesignNode->addchild("div")->addattr("id","CombatTestContainer")->addattr("class","hidden");
	$CombatTestContainer->addchild("div")->addtext("X")->addattr("class","CloseButton");


	$HelperTextContainerNode = &$DesignNode->addchild("div")->addattr("id","HelperTextContainer")->addattr("class","hidden");
	$HelperTextContainerNode->addchild("div")->addtext("X")->addattr("class","CloseButton");
	$HelperTextNode = &$HelperTextContainerNode->addchild("div")->addattr("id","HelperText");
	$HelperTextNode->addtext("Ship design: Ships are made up of three types of components:")->addchild('br');
	$HelperTextNode->addtext("Hull ")->addchild('img')->addattr('src','./pix/Hull.png');
	$HelperTextNode->addtext(', Corridor ')->addchild('img')->addattr('src','./pix/Room.png');
	$HelperTextNode->addtext(', and Systems ')->addchild('img')->addattr('src','./pix/System.png');
	$HelperTextNode->addtext(', ')->addchild('img')->addattr('src','./pix/PowerSupply.png');
	$HelperTextNode->addtext(', ')->addchild('img')->addattr('src','./pix/OxygenGen.png');
	$HelperTextNode->addtext('.');

	$HelperTextNode->addchild('p')->addtext("Each component has it's own O2, Heat and Energy value, these will flow into the neighbouring components (6 nearest neighbours only - 4 on each side plus 1 each above and below). Extra Decks can be views using the +/- buttons on the right.");
	$HelperTextNode->addtext("Systems use up energy, but generate heat. The O2 generator is a special type of system which ");
	$HelperTextNode->addtext(" creates oxygen for your crew (other systems use up a tiny amount of oxygen when they are working).");
	$HelperTextNode->addtext(" The PowerSupply (PS) generates energy for other systems to use, but if it is disconnected will build up energy");
	$HelperTextNode->addtext(" and eventually explode (you can check the temperature to see it heating up).  ");
	$HelperTextNode->linebreak()->linebreak()->addtext("Heat is generated by the normal operation of systems or excess energy in any component.");
	$HelperTextNode->addtext(" Any component which overheats will take damage and eventually explode. To avoid this build heat sinks: Any hull component exposed to space will");
	$HelperTextNode->addtext(" sink emit heat into space; thus reducing the heat of that component. Large arrays of hull elements spaced to expose as much surface to space as possible can sink huge amount of heat.");

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

//if($_POST['ajax'] != 'true') { $MenuNode = $this->GetMenuNode();}

$jsString = file_get_contents('./js/TechDesign.js');
if($jsString)
{
	$Script = new htmlphp('script','attachjs');
	$Script->addattr('js', $jsString);
} else $Script = '{}';
//$Script = str_replace('\t','',$Script);
//$Script = str_replace('\n','',$Script);
	return $this->BuildJSONArray($Node,$MenuNode,$Script);
 }
}

?>
