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
	$Node->addattr('class','content hidden bgbox')->addattr('id',get_class($this))->addchild('span')->addattr('id','TechHeader')->addtext("HEADER");
	$Node->addchild("br");
	$Node->addchild("div")->addattr("id","Research")->addattr("class","hidden")->addtext("This is a stub for the research tab.");
	$DesignNode = &$Node->addchild('div')->addattr("id","Design");
    $DesignNode->addchild('input')->addattr('type','button')->addattr('id',"newship")->addattr("value","New");
	$DesignNode->addchild('input')->addattr('type','button')->addattr('onclick',"alert('Loading - none')")->addattr("value","Load");
	$DesignNode->addchild('input')->addattr('type','button')->addattr('onclick',"alert('Saving - none')")->addattr("value","Save");
	$DesignNode->addchild("br");
	$ColumnleftNode = &$DesignNode->addchild("div")->addattr("id","columnleft");
	$ColumnleftNode->addchild('div')->addattr("class","DesignUnit Dragable")->addattr("id","Red")->addattr("draggable","true");
	$ColumnleftNode->addchild('div')->addattr("class","DesignUnit Dragable")->addattr("id","Blue")->addattr("draggable","true");
	$ColumnleftNode->addchild('div')->addattr("class","DesignUnit Dragable")->addattr("id","Yellow")->addattr("draggable","true");
	$DesignNode->addchild("div")->addattr("class","DropTarget")->addattr("id","DesignCanvas");
//->addchild("span")->addattr("class","DesignGrid");

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

	$Script = new htmlphp('script');
	$Script->addattr('js',/*var GridEle = $(".DesignGrid"); var total = (640/20)*(480/20 +1) -1;
				for(var i=0;i < total;i++){$(GridEle).clone().appendTo("#DesignCanvas")  }*/
				'$("#newship").click(function() {$("#NewDesignForm").show(200);});
				$("#SubmitDesignName").click( function(){ 
								$("#TechHeader").text("Design Name: "+$("#DesignNameText").val());
								ObjDesign = new ShipDesign( $("#DesignNameText").val() );//DO SOMETHING! 
								$("#NewDesignForm").hide(200); 
								$("#NewShipForm").trigger("reset");
				});
				$(".CloseButton").click(function() {$(this).parent().hide(200)});
				$(".TextInput").focus(function() {if($(this).val() == "...") $(this).val("")});
				$(".Dragable").bind("touchstart",function (event){alert("touch event@:"+event)})
	//			$(".Dragable").click(function(event){ $(".Dragable").css("cursor","crosshair") });
				$(".Dragable").bind("dragstart",function (event){
					dataTransfer = event.originalEvent.dataTransfer;
					dataTransfer.setData("Text",event.target.id);
				});
				$(".DropTarget").bind("drop",function (event){
					event.preventDefault(); var Zed = 2;
					var top = event.originalEvent.pageY, left = event.originalEvent.pageX; //console.log("top " + event.originalEvent.pageY+ " canvas.top "+$("#DesignCanvas").offset().top +" left "+event.originalEvent.pageX + " canvas.left "+$("#DesignCanvas").offset().left );
					top = top - $("#DesignCanvas").offset().top - 5; left = left - $("#DesignCanvas").offset().left - 5;
					top = top - top%20; left = left - left%20;
					var data=event.originalEvent.dataTransfer.getData("Text");
					ObjDesign.AddComponent( (left/20),(top/20),Zed,$("#"+data).css("background-color") );
					ObjDesign.ReDrawComponents(Zed);
		//			$("#"+data).clone().appendTo($("#DesignCanvas")).css({"position":"absolute","border":"0px","top":top+"px","left":left+"px"});
					//$(event.target).css("background-color","green");
					/*$(event.target).css("background-color",$("#"+data).css("background-color"));*/
					});
				$(".DropTarget").bind("dragover", function (event){event.preventDefault();});');
// 768 20x20 pixel elements in a 640*400 pixel element
//	$('.Dragable').css('cursor','crosshair' ) });// cursor modification is cool, may have to use it elsewhere...
/* //appendChild(document.getElementById(data).cloneNode(true)); */
	return '['.$Node.','.$Script.']';

 }
}

?>
