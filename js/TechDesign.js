var Technology = function() {return StateClass('Technology');}

Technology.prototype.EnterState = function ()
{
	$("div#Design").on("click", "div:not('#columnleft'),input,img" ,function(event)
	{
		//	console.log("trigger: "+ $(this).attr("id")+ " "+ $(event.target).attr('class')+'  who'+event);
		switch(event.currentTarget.id) // event.target.id OR currentTarget.id ?? stop bubbling?
		{
		case 'DesignHelp': $("#HelperTextContainer").show(200); break;
		case 'SubmitDesignName' : { //alert(' submitform '+$("#DesignNameText").val() );
									$("#TechHeader").text("Design Name: "); $("#NameHeader").text($("#DesignNameText").val());
									Client.ObjDesign = new ShipDesign( $("#DesignNameText").val(), 'private', Client.Player.Name  ); Client.ObjDesign.ReDrawComponents(); 
									$("#NewDesignForm").hide(200); 
									$("#NewShipForm").trigger("reset");
									$('#EditDesign').trigger('click');
									event.stopPropagation();
								} break;
		case 'NewShip' : $("#NewDesignForm").show(200); break;
		case 'Save' : Client.ObjDesign.Save();  break;
		case 'CombatTest': 
			if(typeof(Client.ObjDesign) == 'undefined') {console.log('Error: no design to test'); break;}
			$("#CombatTestContainer").show(200);
			Client.ObjDesign.Canvas.empty();
			Client.ObjDesign.Canvas = $("#EquipCanvas");
			Client.ObjDesign.ColourMapTo('none');
			$('#EquipCanvas').droppable();
			$('#EquipForm .DesignEquip').draggable({
				cursor: "auto, move",
				helper: "clone", 
				start: function( event, ui ) { ui.helper.css('border','0px'); },
				stop: function( event, ui ) {console.log('drag stop.');}
			});
			$('#EquipCanvas').droppable({
				activate: function(event, ui) { $(this).children('.System').css('box-shadow', '0 0 20px #ff0 inset'); },
				deactivate: function(event, ui) {$(this).children('.System').css('box-shadow', 'none'); }
			});
			break;
		case 'ExitCombatTest' :
			Client.ObjDesign.Canvas = $("#DesignCanvas");
			Client.ObjDesign.ReDrawComponents();
			break;
		case 'OpenShareDesign' :
				if(!Client.hasOwnProperty('ObjDesign') ) { Client.ErrorOutput('No design to share, please try creating a new design.'); return;}
				else {
					//$("#ShareDesignForm").hide(200);
					Client.ObjDesign.RefreshShareForm();
					$("#ShareDesignForm").show(200);
				}
			break;
		case 'OpenLoadDesignForm' : 
		$.ajax(
		   {
			url: "./index.php",
			type:'POST',
			data:'ajax=true&tab=LoadDesignForm',
			beforeSend: function() {$("#loading").show();},
			success:function(data) { $("#loading").hide(); Client.evalJSON(data); $("#LoadDesignFormContainer").show(200); }
		   }
		  ); break;
		case 'LoadDesign' : event.stopPropagation();
		$.ajax(
		   {
			url: './index.php' ,
			type:'POST',
			data:'ajax=true&tab=LoadDesign&DesignName='+ $('#DesignName').find(":selected").text(),
			beforeSend: function() {$("#loading").show();},
			success:function(data) { 
				$("#loading").hide(); 
				var Design = JSON.parse(data); //console.log(Design); 
				$("#TechHeader").text("Design Name: "); $("#NameHeader").text(Design[0].Name);
				Client.ObjDesign = new ShipDesign(Design[0].Name, Design[1], Design[2]); //should the client handle this? probably...
				Client.ObjDesign.MultiAddComponents(Design[0].Components)
				Client.ObjDesign.ReDrawComponents();
				$("#LoadDesignFormContainer").hide(200);
				$('#EditDesign').trigger('click');								
				} 
		   });
			break;
		case 'ShowDesignDetails': //console.log('event: '+event+' '+event.target.id+' '+event.currentTarget.id);//event.stopPropagation();
				var DesignNum = $('#DesignName').find(":selected").val(); // HTML ids can't have any spaces in them.
				$(".DesignDesc").hide(200);
				$("#"+DesignNum+"Desc").show(200);
				$("#DescContainer").show(200);
			break;
		case 'EditDescription': event.stopPropagation(); 
				var DesignNum = $('#DesignName').find(":selected").val();
				var DescNode = $("#"+DesignNum+"Desc").attr('contentEditable',"true").addClass('EditText');
				alert('FEATURE INCOMPLETE, descriptions can\'t be saved at present.');
			break;
		case 'TestDesign' : { Client.ObjDesign.TestDesign( $("#TestDesign") ); } break;

		case 'O2Display' : Client.ObjDesign.ColourMapTo('O2'); break;
		case 'HeatDisplay' : Client.ObjDesign.ColourMapTo('Heat'); break;
		case 'EnergyDisplay' : Client.ObjDesign.ColourMapTo('Energy'); break;
		case 'RenameDesign' : Client.ObjDesign.RenameButton($(this)); break;
		case 'EditDesign': {
						 if( $(this).attr("value") == "Edit Design")
						{
							if(!Client.hasOwnProperty('ObjDesign') ) { Client.ErrorOutput('Nothing to edit, please try creating a new design.'); console.log(' no object'); return} else
							Client.ObjDesign.EditMode = true;	
							$('#DesignManager').hide(100);
							$('#DesignTesting').show(100);
							$(".DesignUnit", "#Design").attr("draggable","true");
							$(".Dragable").on('click.design', function(event){ Client.ObjDesign.PlaceMode(event.target.id); $("div#DesignCanvas").css("cursor", $(event.target).css("background-image")+",auto" ) } );
							$(".Dragable").on("dragstart.design",function (event){ event.originalEvent.dataTransfer.setData("Text",event.target.id); });
							$("#DesignCanvas").on('mousemove.design', function(event) {
								var top = event.originalEvent.pageY, left = event.originalEvent.pageX;
								top = top - $("#DesignCanvas").offset().top; left = left - $("#DesignCanvas").offset().left;
								top = top - top%20; left = left - left%20;
								$("#DesignHighligther").css({'top':(top+57)+'px','left':(left+43)+'px', 'z-index':-1, 'opacity':  0.8 ,'background-color':'darkgreen' }).show(200);								
							})
							$(".DropTarget", "#Design").on("drop.design",function (event){
								event.preventDefault(); 
								var top = event.originalEvent.pageY, left = event.originalEvent.pageX;
								top = top - $("#DesignCanvas").offset().top; left = left - $("#DesignCanvas").offset().left;
								top = top - top%20; left = left - left%20;
								var data=event.originalEvent.dataTransfer.getData("Text");
								if( $("#"+data).hasClass("DesignUnit")  )
								{
									Client.ObjDesign.AddComponent( (left/20),(top/20),Client.ObjDesign.Zed,$("#"+data).attr("id") );
									Client.ObjDesign.ReDrawComponents();
								}
								else if( $("#"+data).hasClass("ShipElement") )
								{
									Client.ObjDesign.MoveComponent( (left/20),(top/20),Client.ObjDesign.Zed,$("#"+data).attr("id").replace("Component","") ); 
									Client.ObjDesign.ReDrawComponents();
								}
							});
							$(".DropTarget", "#Design").on("dragover.design", function (event){event.preventDefault();});
							$(".DropTarget", "#Design").on('click.design', function(event) { 
								var top = event.originalEvent.pageY, left = event.originalEvent.pageX; 
								top = top - $("#DesignCanvas").offset().top + 10; left = left - $("#DesignCanvas").offset().left + 10;
								top = top - top%20; left = left - left%20;
								if(Client.ObjDesign !== undefined && Client.ObjDesign.ToPlace !== 'none')
								{ Client.ObjDesign.AddComponent( (left/20),(top/20),Client.ObjDesign.Zed,Client.ObjDesign.ToPlace ); }
								Client.ObjDesign.ReDrawComponents();
							});
							$(this).attr("value", "\u0298");
							$(window).on('keypress.DesignKeys', function(event) {
								if(event.which == 43) { Client.ObjDesign.ChangeZed(1) }// plus
								else if(event.which == 45) {Client.ObjDesign.ChangeZed(-1) }// minus
							});

							$("#Technology").on("mousewheel", function(event) {
								//console.log("mouse wheel - delta ("+ event.originalEvent.deltaX+','+event.originalEvent.deltaY+')');
								Client.ObjDesign.ChangeZed(event.originalEvent.deltaY);
								return false;
							})

						}
						else if(  $(this).attr("value") == "\u0298" ) 
						{
							Client.ObjDesign.EditMode = false;
							$('#DesignTesting').hide(100);
							$('#DesignManager').show(100);
							$(window).off('keypress.DesignKeys');
							$("#Technology").off("mousewheel");
							$(".DesignUnit", "#Design").add('.ShipElement',"#DesignCanvas").attr("draggable","false");
							$(".Dragable").off('.design');
							$(".DropTarget", "#Design").off(".design");
							$("#DesignCanvas").off('mousemove.design');
							$("div#DesignCanvas").css("cursor", "auto" ) ;
							if( 'IntervalTimer' in window) {clearInterval(IntervalTimer); $("#TestDesign").attr("value","Test Design"); }//stop any current testing // This should not duplicate testdesign function? 
							$(this).attr("value", "Edit Design");
						}


					} break;
		default:  
		var TestCSSClasses = new Array('ZIndexPlus','ZIndexMinus','XYpan');	
		for(var i =0, l = TestCSSClasses.length; i < l; i++)
			{
				if($(event.currentTarget).hasClass(TestCSSClasses[i]))
				switch(TestCSSClasses[i])
				{
					case 'ZIndexPlus' : { Client.ObjDesign.ChangeZed(1); } break;
					case 'ZIndexMinus' : { Client.ObjDesign.ChangeZed(-1); } break;
					case 'XYpan' : { if( $('#DesignCanvas').css('cursor')	== 'auto' ) 
										{console.log('switching to pan'); // not currently functional
										$('#DesignCanvas').css('cursor','url(./pix/pan.png),move');
										$('#DesignCanvas').on('selectstart.pan', function(event) {return false});
										}
									else { console.log(' switch to no pan'); $('#DesignCanvas').off('.pan'); $('#DesignCanvas').css('cursor','auto');}
								   }
					break;
				}
			}
		}			
	});
	$(".TextInput").on('focus', function() {if($(this).val() == "...") $(this).val("")}); // is this shared??
	$("div#Design").on('click',".ReloadButton" ,function() {alert('Reload not implemented.')} );
	$(".Dragable").on("touchstart",function (event){alert("touch event@:"+event)}); // for touchscreen support!


/* !dragover // i want : event.type, event.which, and event.target, and sometimes event.pageX/Y */
// CHANGING to jquery UI for drag.
	$('#Technology').show(200);
}

Technology.prototype.ExitState = function ()
{  
	$("div#Design").off('click');
	$(".TextInput").off('click');
	$(".Dragable").off('touchstart');
	$('#Technology').hide(200); 
} 

/*		$("#LoadDesignFormContainer").on('click','input#LoadDesign',function() {

		});

*/

