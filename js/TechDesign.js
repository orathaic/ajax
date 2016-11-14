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
				
				var EditMode = false;				
				if(Client.ObjDesign) {EditMode = Client.ObjDesign.EditMode;} // store the editmode and apply to the new design object
				
				Client.ObjDesign = new ShipDesign(Design[0].Name, Design[1], Design[2]); //should the client handle this? probably...
				Client.ObjDesign.MultiAddComponents(Design[0].Components)
				Client.ObjDesign.ReDrawComponents();
				Client.ObjDesign.EditMode = EditMode;
				$("#LoadDesignFormContainer").hide(200);
				Client.ObjDesign.DisableEditMode(Client.ObjDesign);
				//console.log('EditMode: '+Client.ObjDesign.EditMode);
				Client.ObjDesign.EnableEditMode(Client.ObjDesign);								
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
							Client.ObjDesign.EnableEditMode(Client.ObjDesign);
						}
						else if(  $(this).attr("value") == "\u0298" ) 
						{
							Client.ObjDesign.DisableEditMode(Client.ObjDesign);
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

