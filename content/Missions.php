<?php

class Missions extends content
{
 function __construct($Game)
	{
		parent::__construct(($this),$Game);
		$this->main = 'Explore - Wish List';
		return;
	}
 
 function __toString()
	{
		$MissionNode = new htmlphp('div','content','PageContainer');
		$MissionNode->addattr('class','content hidden bgbox')->addattr('id',get_class($this));
		$MissionNode->addtext('Missions Wish List')->linebreak();
		$Wishlist = & $MissionNode->addchild('ul');
		$Wishlist->addchild('li')->addtext('NPC missions to protect the Empire/Rebels/IPX/Science Institute.');
		$Wishlist->addchild('li')->addtext('Status benefits and ranks for completed jobs.');
		$Wishlist->addchild('li')->addtext('Player created missions to advance (their) goals.');
		$Wishlist->addchild('li')->addtext('Player set bounties for \'bad\' behaviour.');
		$Wishlist->addchild('li')->addtext('Procedurally created missions to find somethign to do.');

		return $this->BuildJSONArray($MissionNode);
	}
}
?>
