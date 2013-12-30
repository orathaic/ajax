<?php

class Junkbar extends content
{
 function __construct($Game)
	{
		parent::__construct(($this),$Game);
		$this->main = 'Explore - Wish List';
		return;
	}
 
 function __toString()
	{
		$JunkBarNode = new htmlphp('div','content','PageContainer');
		$JunkBarNode->addattr('class','content hidden bgbox')->addattr('id',get_class($this));
		$JunkBarNode->addtext('Junk-Bars Wish List')->linebreak();
		$Wishlist = & $JunkBarNode->addchild('ul');
		$Wishlist->addchild('li')->addtext('Public Chat channel.');
		$Wishlist->addchild('li')->addtext('Notice board.');
		$Wishlist->addchild('li')->addtext('Private chat.');
		$Wishlist->addchild('li')->addtext('Player Status/rewards.');

		return $this->BuildJSONArray($JunkBarNode);
	}
}
?>
