<?php
class SpacePort extends content
{
	 function __construct($Game)
	 {
		parent::__construct(get_class($this),$Game);
		$this->Main = 'Welcome to Spaceport: [INSERT_NAME]';
		return;
	 }
	function GetMenuNode()
	{
		$MenuNode = new htmlphp('div','content','Console');	
		$MenuNode->addattr('id','MenuNode')->addtext('Hi ')->addchild('span')->addattr('id','GetOptions')->addtext($this->Game->Account->GetUsername().', ');
		$MenuNode->addchild('a')->addtext('Logout?')->addattr('id','LogoutLink');
		return $MenuNode;
	}	 

	 function __toString()
	{
		$MenuNode = $this->GetMenuNode();
		$SpacePortNode = new htmlphp('div','content','Console');
		$SpacePortNode->addattr('id','SpacePort')->addattr('class','hidden')->addtext('Welcome to Spaceport: [INSERT_NAME]:');
		$SpacePortNode->addchild('br');		
		$SpacePortNode->addchild('input')->addattr('class','menuitem')->addattr('type','button')->addattr('value','Missions')->addattr('name','Missions');
		$SpacePortNode->addchild('input')->addattr('class','menuitem')->addattr('type','button')->addattr('value','Explore')->addattr('name','Explore');
		$SpacePortNode->addchild('br');
		$SpacePortNode->addchild('input')->addattr('class','menuitem')->addattr('type','button')->addattr('value','Junk-bar')->addattr('name','Junkbar');
		$SpacePortNode->addchild('input')->addattr('class','menuitem')->addattr('type','button')->addattr('value','Technology')->addattr('name','Technology');

		$jsString = file_get_contents('./js/ConsoleMain.js');
		if($jsString)
		{
			$Script = new htmlphp('script','attachjs');
			$Script->addattr('js', $jsString);
		} else $Script = '{}';

		$jsString = file_get_contents('./js/SpacePort.js');
		if($jsString)
		{
			$Script2 = new htmlphp('script','attachjs');
			$Script2->addattr('js', $jsString);
		} else $Script2 = '{}';

//		$Calljs = new calljs('ChangeTo',array('SpacePort')); // this should be done on the client side.
		return $this->BuildJSONArray($MenuNode,$SpacePortNode,$Script,$Script2,$Calljs);
	 }
}
?>
