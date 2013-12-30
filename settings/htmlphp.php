<?php
class htmlphp
{
	function __construct($tagname, $cmd = false, $location = false)
 	{
	 if($location) $this->loc = $location;
	 if($cmd) $this->cmd = $cmd;	 
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
	function linebreak()
	{
	$this->children[] = new htmlphp('br');
	return $this;
	}

	function __toString()
	{
	 return json_encode($this);
	}
}

class calljs
{
	function __construct($func = NULL, $args= NULL)
 	{
	$this->cmd = 'calljs';
	if($func) $this->func = $func;
	if($args) {$i = 0; foreach($args as $arg) {$this->args[$i] = $arg; $i++;}}
	if($args) {/*debug output*/ $this->FirstArg = $this->args[0];}
	return $this;
	}
	function addattr($attribute, $value)
	{
	 $this->attr[$attribute] = $value;
	 return $this;
	}
	function __toString()
	{
	 return json_encode($this);
	}
}

?>
