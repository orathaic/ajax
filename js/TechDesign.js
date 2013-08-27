
$("div#Design").on("click", "div:not('#columnleft'),input" ,function(event) {
//	console.log("trigger: "+ $(this).attr("id")+ " "+ $(event.target).attr('class')+'  who'+event);

	switch(event.target.id)
	{
	case 'DesignHelp': $("#HelperTextContainer").show(200); break;
	case 'SubmitDesignName' : { //alert(' submitform '+$("#DesignNameText").val() );

								$("#TechHeader").text("Design Name: "); $("#NameHeader").text($("#DesignNameText").val());
								ObjDesign = new ShipDesign( $("#DesignNameText").val() ); ObjDesign.ReDrawComponents(2); 
								$("#NewDesignForm").hide(200); 
								$("#NewShipForm").trigger("reset");
								$('#EditDesign').trigger('click');
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
					 { IntervalTimer=setInterval( function(){ObjDesign.Simulate()}, 40); $("#TestDesign").attr("value","Stop Testing"); }
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
	case 'RenameDesign' : //console.log($(this) ); 
				if($(this).val() =='Rename') {
							$(this).attr('type','text').val($("#NameHeader").text());
							$(this).on('keydown.renameform', function(event){ //console.log(event+' '+event.which);
										if(event.which == 13) { //console.log('13 '+this.value);
											$('#NameHeader').text($(this).val()); 
											ObjDesign.DesignName = $(this).val();
											$('#RenameDesign').off('.renameform').attr('type','button').val('Rename'); 
											//console.log("off :" + $('#RenameDesign').attr('type') );
											event.stopPropagation();
											return false;
										}  
									});			
						}
				 break;
	case 'EditDesign': {
					 if( $(this).attr("value") == "Edit Design")
					{
						if(!('ObjDesign' in window)) {alert('Nothing to edit, please try creating a new design.'); console.log(' no object'); return} else
						ObjDesign.EditMode = true;	
						$('#DesignManager').hide(100);
						$('#DesignTesting').show(100);
						$(".DesignUnit", "#Design").attr("draggable","true");
						$(".Dragable").on('click.design', function(event){ ObjDesign.PlaceMode(event.target.id); $("div#DesignCanvas").css("cursor", $(event.target).css("background-image")+",auto" ) } );
						$(".Dragable").on("dragstart.design",function (event){ event.originalEvent.dataTransfer.setData("Text",event.target.id); });
						$(".DropTarget", "#Design").on("drop.design",function (event){
							event.preventDefault(); var Zed = 2;
							var top = event.originalEvent.pageY, left = event.originalEvent.pageX;
							top = top - $("#DesignCanvas").offset().top + 10; left = left - $("#DesignCanvas").offset().left + 10;
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
						$(".DropTarget", "#Design").on("dragover.design", function (event){event.preventDefault();});
						$(".DropTarget", "#Design").on('click.design', function(event) { var Zed = 2;
							var top = event.originalEvent.pageY, left = event.originalEvent.pageX; 
							top = top - $("#DesignCanvas").offset().top + 10; left = left - $("#DesignCanvas").offset().left + 10;
							top = top - top%20; left = left - left%20;
							if(ObjDesign !== undefined && ObjDesign.ToPlace !== 'none') ObjDesign.AddComponent( (left/20),(top/20),Zed,ObjDesign.ToPlace );
							ObjDesign.ReDrawComponents(Zed);
						});
						$(this).attr("value", "\u0298");
					}
					else if(  $(this).attr("value") == "\u0298" ) 
					{
						ObjDesign.EditMode = false;
						$('#DesignTesting').hide(100);
						$('#DesignManager').show(100);
						
						$(".DesignUnit", "#Design").add('.ShipElement',"#DesignCanvas").attr("draggable","false");
						$(".Dragable").off('.design');
						$(".DropTarget", "#Design").off(".design"); 
						if( 'IntervalTimer' in window) {clearInterval(IntervalTimer); $("#TestDesign").attr("value","Test Design"); }//stop any current testing 
						$(this).attr("value", "Edit Design");
					}


				} break;
	default:  
	}
});
/* !dragover // i want : event.type, event.which, and event.target, and sometimes event.pageX/Y */

		$(".TextInput").on('focus', function() {if($(this).val() == "...") $(this).val("")});
		$(".Dragable").on("touchstart",function (event){alert("touch event@:"+event)});
		$("#LoadDesignFormContainer").on('click','input#LoadDesign',function() {
		$.ajax(
		   {
			url: 'content.php?tab=LoadDesign&'+ $('#LoadDesignForm').serialize(),
			beforeSend: function() {$("#loading").show();},
			success:function(data) { 
				$("#loading").hide(); 
				var Design = JSON.parse(data); 
				$("#TechHeader").text("Design Name: "); $("#NameHeader").text(Design[0].Name);
				ObjDesign = new ShipDesign(Design[0].Name);
				for(var i=0,l=Design[0].Components.length; i < l; i++)
					{
					var Cp = Design[0].Components[i];
					ObjDesign.AddComponent(Cp.x,Cp.y,Cp.z,Cp.Type);
					}
				ObjDesign.ReDrawComponents(2);
				$("#LoadDesignFormContainer").hide(200);
				$('#EditDesign').trigger('click');
									
				} 
		   });
		});


