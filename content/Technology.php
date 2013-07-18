<?php

class Technology extends content
{

 function __construct()
 {
	parent::__construct();
	$this->main = 'Tech - Canvas test';
	return;
 }
 
 function __toString()
 {
	$Node = new htmlphp('div');
	$Node->addattr('class','content hidden bgbox')->addattr('id',get_class($this))->addtext("HEADER");
	$Node->addchild("br");
	$Node->addchild("div")->addattr("id","Research")->addattr("class","hidden")->addtext("This is a stub for the research tab.");
	$DesignNode = &$Node->addchild('div')->addattr("id","Design");
	$DesignNode->addchild('input')->addattr('type','button')->addattr('onclick',"alert('Loading - none')")->addattr("value","Load");
	$DesignNode->addchild('input')->addattr('type','button')->addattr('onclick',"alert('Saving - none')")->addattr("value","Save");
	$DesignNode->addchild("br");
	$ColumnleftNode = &$DesignNode->addchild("div")->addattr("id","columnleft");
//	$ColumnleftNode->addattr("id","columnleft");
	$ColumnleftNode->addchild('div')->addattr("class","DesignUnit Dragable")->addattr("id","Red");
	$ColumnleftNode->addchild('div')->addattr("class","DesignUnit Dragable")->addattr("id","Blue");
	$ColumnleftNode->addchild('div')->addattr("class","DesignUnit Dragable")->addattr("id","Yellow");
	$DesignNode->addchild("div")->addattr("class","DropTarget")->addattr("id","DesignCanvas");
	return 'node='.$Node;
/*	return 'node = {
		"tagName":"div",
		"className":"content hidden bgbox",
		"attr":{"id":"'.get_class($this).'"},
		"children": [{"text":"HEADER"},{"tagName":"br"},
			{"tagName":"div", "className":"hidden",
			"attr":{"id":"Research"},"children":[{"text":"This is a stub for the research tab."}]},
			{"tagName":"div", "attr":{"id":"Design"},
			"children":[
				{"tagName":"input","attr":{"type":"button","onclick":"alert(\'Loading - none\')","value":"Load"} },
				{"tagName":"input","attr":{"type":"button","onclick":"alert(\'Saving - none\')","value":"Save"} },
				{"tagName":"br"},
				{"tagName":"div","attr":{"id":"columnleft"},
				"children":[
					{"tagName":"div","className":"DesignUnit Dragable","attr":{"id":"Red"}},
					{"tagName":"div","className":"DesignUnit Dragable","attr":{"id":"Blue"}},
					{"tagName":"div","className":"DesignUnit Dragable","attr":{"id":"Yellow"}}
					]
				},
				{"tagName":"div","className":"DropTarget","attr":{"id":"DesignCanvas"}},
				]
			}
			]
		}';*/

/*	$toreturn = "<div class='content hidden bgbox' id=".get_class($this).">HEADER<br />
	<div class='hidden' id='Research'>This is a stub for the research tab.</div>
	<div id='Design'>
	 <input type=button onclick=alert('Loading - none') value=Load><input type=button onclick=alert('Saving - none') value=Save>
	 <br />
	 <div id='columnleft'>
	   <div class='DesignUnit Dragable' id=Red></div><div class='DesignUnit Dragable' id=Blue></div><div class='DesignUnit Dragable' id=Yellow></div>
	 </div>
	 <div class=DropTarget id='DesignCanvas'></div>
	</div>
      </div>";*/
 }
}
/* // to be included as JSON, all of this should be JSON-ified
function Extras(){
//	$('.Dragable').mousemove(function(event) {console.log('mouse')});

	$('.Dragable').click(function(event){ console.log('clicked dragable'); $('.Dragable').css('cursor','crosshair' ) });
/*	$('.DropTarget').bind('drop',function (event){
			event.preventDefault(); 
			var data=event.dataTransfer.getData('Text');
			event.target.appendChild(document.getElementById(data).cloneNode(true));
			});
$(".DropTarget').bind('dragover', function (event){event.preventDefault();});*/ /*
};
*/

?>


