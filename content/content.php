<?php

class content
{
 function __construct($Tab,$Game = Null)
 {
	if($Game != Null) $this->Game = $Game; else $this->Game = 'Error';
	$this->Main = 'Default contents';
	$this->RequestTab = $Tab;
	return;
 }
 function __toString()
 {
	// page know how to display content, so there should be no html/css here.
	// format - id to update, content to place -> id,content
	// Send JSON down, page can parse and add to DOM, or eval JS

	$tag = new htmlphp('div','content','PageContainer');
	$tag->addattr('id',$this->RequestTab)->addattr('class','content hidden bgbox')->addtext('Error: tab - '.$this->RequestTab.' should not be displayed, please ignore this issue.');
	return $this->BuildJSONArray($tag);
 }

 function GetMain()
 {
	return '{"loc":"PageContainer","tn":"div","attr":{"class":"title"},"children":[{"tn":"text","text":"'.$_GET['tab']." ".$this->main.'"}]}';
 }

 function BuildJSONArray()
	{
		$Builder = '[';
		$ArgArray = func_get_args(); 
		foreach($ArgArray as $value) { if($value != '') $Builder .= $value.','; }
	//	$Builder = rtrim($Builder, ','); 
		if(isset($this->Game->Account)) {$Builder .= new calljs('SetUsername',array("{$this->Game->Account}"));}
		$Builder .= ']';
		return $Builder;
	}

}

?>
