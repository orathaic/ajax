
$("div#Design").on("click", "div:not(\'#columnleft\'),input" ,function(event) {
//	console.log("trigger: "+ $(this).attr("id")+ " "+ $(event.target).attr('class'));

	switch(event.target.id)
	{
	case 'DesignHelp': $("#HelperTextContainer").show(200); break;
	case 'SubmitDesignName' : { //alert(' submitform '+$("#DesignNameText").val() );
								$("#TechHeader").text("Design Name: "+$("#DesignNameText").val());
								ObjDesign = new ShipDesign( $("#DesignNameText").val() ); ObjDesign.ReDrawComponents(2); 
								$(".DesignUnit", "#Design").attr("draggable","true");
								$("#NewDesignForm").hide(200); 
								$("#NewShipForm").trigger("reset");
								$('#DesignTesting').show(100);
								event.stopPropagation();
							} break;
	case 'NewShip' : $("#NewDesignForm").show(200); break;
	case 'Save' : ObjDesign.Save();  break;
	case 'OpenLoadDesignForm' : 
	$.ajax(
	   {
		url: "./content.php?tab=LoadDesignForm&return=html",
		beforeSend: function() {$("#loading").show();},
		success:function(data) { $("#loading").hide(); $("#LoadDesignFormContainer").html(data).show(200); }
	   }
	  ); break;
	case 'TestDesign' : { 
					if( $("#TestDesign").attr("value") == "Test Design")
					 { IntervalTimer=setInterval( function(){ObjDesign.Simulate()}, 20); $("#TestDesign").attr("value","Stop Testing"); }
					else
					 { clearInterval(IntervalTimer); $("#TestDesign").attr("value","Test Design"); }
					} break;
	case 'O2Display' : {
					if(ObjDesign.ColourMap != "O2" ) 
						ObjDesign.SetColourMap("O2");
					else
						ObjDesign.SetColourMap("none");
					ObjDesign.ReDrawComponents(2);
				} break;
	case 'HeatDisplay' : {
					if(ObjDesign.ColourMap != "Heat" )
						ObjDesign.SetColourMap("Heat");
					else
						ObjDesign.SetColourMap("none");
					ObjDesign.ReDrawComponents(2);
				} break;
	case 'EnergyDisplay' : {
					if(ObjDesign.ColourMap != "Energy" ) ObjDesign.SetColourMap("Energy");
					else ObjDesign.SetColourMap("none");
					ObjDesign.ReDrawComponents(2);
				} break;
	default:  
	}
});
/* !dragover // i want : event.type, event.which, and event.target, and sometimes event.pageX/Y */

		$(".TextInput").focus(function() {if($(this).val() == "...") $(this).val("")});
		$(".Dragable").bind("touchstart",function (event){alert("touch event@:"+event)});
		$(".Dragable").click(function(event){ ObjDesign.PlaceMode(event.target.id); $("div#DesignCanvas").css("cursor", $(event.target).css("background-image")+",auto" ) } );
		$(".Dragable").bind("dragstart",function (event){ event.originalEvent.dataTransfer.setData("Text",event.target.id); });
		$(".DropTarget", "#Design").bind("drop",function (event){
			event.preventDefault(); var Zed = 2;
			var top = event.originalEvent.pageY, left = event.originalEvent.pageX; /*console.log("top " + event.originalEvent.pageY+ " canvas.top "+$("#DesignCanvas").offset().top +" left "+event.originalEvent.pageX + " canvas.left "+$("#DesignCanvas").offset().left );*/
			top = top - $("#DesignCanvas").offset().top - 5; left = left - $("#DesignCanvas").offset().left - 5;
			top = top - top%20; left = left - left%20;
			var data=event.originalEvent.dataTransfer.getData("Text");
			if( $("#"+data).hasClass("DesignUnit")  )
			{
				ObjDesign.AddComponent( (left/20),(top/20),Zed,$("#"+data).attr("id") );
				ObjDesign.ReDrawComponents(Zed);
			}
			else if( $("#"+data).hasClass("ShipElement") )
			{
				ObjDesign.MoveComponent( (left/20),(top/20),Zed,$("#"+data).attr("id").replace("Component","") ); 
				ObjDesign.ReDrawComponents(Zed);
			}
		}); 
		$(".DropTarget", "#Design").bind("dragover", function (event){event.preventDefault();});
		$(".DropTarget", "#Design").click( function(event) { var Zed = 2;
			var top = event.originalEvent.pageY, left = event.originalEvent.pageX; 
			top = top - $("#DesignCanvas").offset().top - 5; left = left - $("#DesignCanvas").offset().left - 5;
			top = top - top%20; left = left - left%20;
			if(ObjDesign !== undefined) ObjDesign.AddComponent( (left/20),(top/20),Zed,ObjDesign.ToPlace );
			ObjDesign.ReDrawComponents(Zed);
		}); 

		$("#LoadDesignFormContainer").on('click','input#LoadDesign',function() {
		$.ajax(
		   {
			url: 'content.php?tab=LoadDesign&'+ $('#LoadDesignForm').serialize(),
			beforeSend: function() {$("#loading").show();},
			success:function(data) { 
				$("#loading").hide(); 
				var Design = JSON.parse(data); 
				$("#TechHeader").text("Design Name: "+Design[0].Name);
				ObjDesign = new ShipDesign(Design[0].Name);
				for(var i=0,l=Design[0].Components.length; i < l; i++)
					{
					var Cp = Design[0].Components[i];
					ObjDesign.AddComponent(Cp.x,Cp.y,Cp.z,Cp.Type);
					}
				ObjDesign.ReDrawComponents(2);
				$("#LoadDesignFormContainer").hide(200);
				$('#DesignTesting').show(100);  	
				$(".DesignUnit", "#Design").attr("draggable","true");
									
				} 
		   });
		});










