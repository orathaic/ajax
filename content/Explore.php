<?php

class Explore extends content
{
 function __construct($Game)
	{
		parent::__construct(($this),$Game);
		$this->main = 'Explore - Wish List';
		return;
	}
 
 function __toString()
	{
		$ExploreNode = new htmlphp('div','content','PageContainer');
		$ExploreNode->addattr('class','content hidden bgbox')->addattr('id',get_class($this));
		$ExploreNode->addtext('Exploration Wish List')->linebreak();
		$Wishlist = & $ExploreNode->addchild('ul');
		$Wishlist->addchild('li')->addtext('IPX (two week) solo missions');
		$Wishlist->addchild('li')->addtext('Local space (ship-to-ship) navigation');
		$Activitylist = & $Wishlist->addchild('li')->addtext('Station/Rocks navigation (on foot)')->addchild('ul');
		$Activitylist->addchild('li')->addtext('Harvest');
		$Activitylist->addchild('li')->addtext('Construction');
		$Activitylist->addchild('li')->addtext('Full PvP');
		$Activitylist->addchild('li')->addtext('Fuel drop');
		$Activitylist->addchild('li')->addtext('Way-points');

		$Wishlist->addchild('li')->addtext('Large scale map');

		return $this->BuildJSONArray($ExploreNode);
	}
}
?>
