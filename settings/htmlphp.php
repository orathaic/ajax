<?php
class htmlphp
{
	function __construct($tagname)
 	{
	 $this->tn = $tagname;
	return $this;
 	}
	function &addchild($value)
	{
	 return $this->children[] = new htmlphp($value);	  
	}
	function addattr($attribute, $value)
	{
	 $this->attr[$attribute] = $value;
	 return $this;
	}
	function addtext($text)
	{
	 $textnode = new htmlphp('text');
	 $textnode->text = $text;
	 $this->children[] = $textnode;
	 return $this;
	}
	function __toString()
	{
	 return json_encode($this);
	}
}

?>
