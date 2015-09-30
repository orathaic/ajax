var Technology = function() {return StateClass('Technology');}

Technology.prototype.EnterState = function () { 

$("div#Design").on("click", "div:not('#columnleft'),input,img" ,function(event) {
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
				if(!Client.hasOwnProperty('ObjDesign') ) { Client.ErrorOutput('No design to share, please try creating a new design.'); return;} else
				//$("#ShareDesignForm").hide(200);
				Client.ObjDesign.RefreshShareForm();
				$("#ShareDesignForm").show(200);
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
				for(var i=0,l=Design[0].Components.length; i < l; i++)
					{
					var Cp = Design[0].Components[i];
					Client.ObjDesign.AddComponent(Cp.x,Cp.y,Cp.z,Cp.Type);
					}
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
								$("#DesignHighligther").css({'top':(top+57)+'px','left':(left+43)+'px', 'z-index':-1, 'opacity':  0.4 ,'background-color':'darkgreen' }).show(200);								
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
								if(Client.ObjDesign !== undefined && Client.ObjDesign.ToPlace !== 'none') Client.ObjDesign.AddComponent( (left/20),(top/20),Client.ObjDesign.Zed,Client.ObjDesign.ToPlace );
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

Technology.prototype.ExitState = function () {  
	$("div#Design").off('click');
	$(".TextInput").off('click');
	$(".Dragable").off('touchstart');
	$('#Technology').hide(200); 
 } 

/*		$("#LoadDesignFormContainer").on('click','input#LoadDesign',function() {

		});

*/

var ShipDesign = function (Name, Share, Owner)
{
	this.DesignName = Name;
	this.OwnerName = Owner;
	this.Share = Share;
	this.Components = [];//new array(new array(new array())); // 3-d array, x,y,z - 
	this.Canvas = $("#DesignCanvas");
	this.ColourMap = 'none';
	this.SystemsActive = 0;
	this.EditMode = false;
	this.ToPlace = 'none';
	this.Zed = '2';
}

ShipDesign.prototype.JSONStringify = function()
{
	var Stringified = '{"Name":"'+this.DesignName+'","Components":[';
	for(var i =0; i< this.Components.length; i++)
	{ 	Cp = this.Components[i];
		Stringified += '{"x":"'+Cp.x+'","y":"'+Cp.y+'","z":"'+Cp.z+'","Type":"'+Cp.Type+'"}';
		if(i< this.Components.length -1) Stringified += ',';
	}	
	return Stringified += ']}';
}

ShipDesign.prototype.RefreshShareForm = function()
	{
		//alert('refreshing... (NOT IMPLEMENTED)');
		$("#ShareDesignFormName").text(this.DesignName);
		$("#ShareDesignFormOwner").text(this.OwnerName);
		$("#ShareDesignFormStatus").text(this.Share);
		$("#ShareDesignFormContainer").show(200);
	}

ShipDesign.prototype.Save = function()
	{ //console.log(this.JSONStringify());
		$.ajax(
		{
		type: 'POST',
		data: {'SaveShipDesign':true,'name':this.DesignName, 'json':this.JSONStringify() } , 
		url: "./index.php",
		statusCode: {404: function() {$("#PageContainer").append("<div class='error content' id='"+tab+"'>Error: Tab "+tab+" not found</div>"); }},
		beforeSend: function() {$('#SimData').text('Saving...').show(500);},
	 	success:function(data) 
		{ 
			if(data === '1') $('#SimData').text('Saved.').delay(500).hide(500);
			else $('#SimData').text(data);
		}, 
		error: 	function(jqXHR, errorstring ) {$('#SimData').text('Error '+errorstring);}

		});
		return 'none';
	}

ShipDesign.prototype.RenameButton = function(jQButton)  // jQelem	
	{ console.log('RenameButton called: '+jQButton);
	if(jQButton.val() =='Rename') {		
		jQButton.attr('type','text').val($("#NameHeader").text());
		jQButton.on('keydown.renameform', function(event){ //console.log(event+' '+event.which);
			if(event.which == 13) { //console.log('13 '+this.value); // 13 is enter.
				Client.ObjDesign.Rename( $(this).val() );
				$('#RenameDesign').off('.renameform').attr('type','button').val('Rename'); 
				event.stopPropagation();
				return false;
				}  
			});		
		}
	}

ShipDesign.prototype.Rename = function(NewName)
	{
		$('#NameHeader').text(NewName); 
		Client.ObjDesign.DesignName = NewName;
	}

ShipDesign.prototype.PlaceMode = function(CompType) 
	{
		switch(CompType) {
			case 'Room': this.ToPlace = CompType; break;
			case 'Hull': this.ToPlace = CompType; break;
			case 'System': this.ToPlace = CompType; break;
			case 'OxygenGen': this.ToPlace = CompType; break;
			case 'PowerSupply': this.ToPlace = CompType; break;
			default: this.ToPlace = 'none';
			} //console.log(this.ToPlace);
	}

ShipDesign.prototype.ColourMapTo = function (ToSet) {
													if(this.ColourMap != ToSet ) 
															this.SetColourMap(ToSet);
														else
															this.SetColourMap("none");
														this.ReDrawComponents();
													}

ShipDesign.prototype.SetColourMap = function(Stat) { this.ColourMap = Stat;}

ShipDesign.prototype.AddComponent = function(x,y,z,Type) { 
															var i = this.CheckDuplicate(x,y,z);
															if(i != false || i === 0 ) {
																this.Components[i].Type = Type; 
																this.Components[i].InitStats(Type); 
																//this.Components[i].BreakLinks();
																//this.Components[i].FindLinks();	
																return;
																}														
															else return this.Components.push(new ShipComponent(x,y,z,Type,this));
															}

ShipDesign.prototype.MoveComponent = function(x,y,z,id) { 
															var i = this.CheckDuplicate(x,y,z);
															if(i != false || i === 0 )
															{return; }
															else this.Components[id].Move(x,y,z); 
														}

ShipDesign.prototype.CheckDuplicate = function(x,y,z) {for(var i=0, l=this.Components.length; i<l; i++)
															{if (this.Components[i].x == x && this.Components[i].y == y && this.Components[i].z == z ) 
																{
																 return i;
																}

															}
														 return false;
														}

ShipDesign.prototype.ChangeZed = function(Direction) { 
			if(Direction > 0) {Client.ObjDesign.Zed++;} 
			else if(Direction < 0 ) {Client.ObjDesign.Zed--;}
			Client.ObjDesign.ReDrawComponents();}

ShipDesign.prototype.ReDrawComponents = function() 
	{ var z = this.Zed;
	 this.Canvas.empty();
	var docFragment = document.createDocumentFragment();
	 for(var i =0; i < this.Components.length; i++)
	 {
	  if(this.Components[i].z <= z) { docFragment = this.Components[i].Draw(docFragment, i, (this.Components[i].z - z) ); };  
	 }
	this.Canvas.append(docFragment);
	 if(this.EditMode) $(".ShipElement").attr("Draggable", true).bind("dragstart",function (event){
					event.originalEvent.dataTransfer.setData("Text",event.target.id);
				});
	 $('#ZedIndexHeader').text(' (deck: '+(z -1)+')');
	}

ShipDesign.prototype.TestDesign = function(Button) {
	if( Button.attr("value") == "Test Design")
	 /*{ IntervalTimer=setInterval( function(){Client.ObjDesign.Simulate()}, 40); Button.attr("value","Stop Testing"); }
	else if (Button.attr("value") == "Stop Testing")
	 { clearInterval(IntervalTimer); Button.attr("value","Test Design"); }*/
	Client.ObjDesign.Simulate();
}

ShipDesign.prototype.Simulate = function() 
{ $('#SimData').show()
 var AverageO2 =0, AverageEnergy = 0, AverageHeat = 0, TotalSystems; 
 for(var k =0; k<1; k++) // k cycles per frame
 { 
 var SumO2 =0, SumE =0; SumH =0; this.SystemsActive = 0; TotalSystems = 0;
 for(var i = 0; i< this.Components.length; i++)
	{ var Cp = this.Components[i]; 
	 Cp.Stats.Energy['Update'] += Cp.Stats.Energy['Level'] - Cp.GetLinkLoss('Energy');
	 Cp.Stats.Heat['Update'] += Cp.Stats.Heat['Level'] - Cp.GetLinkLoss('Heat');
	 Cp.Stats.O2['Update'] += Cp.Stats.O2['Level'] - Cp.GetLinkLoss('O2');
	}
 for(var i = 0; i< this.Components.length; i++)
	{ var Cp = this.Components[i];
	Cp.Stats.Heat['Level'] = Cp.Stats.Heat['Update']; //console.log(Cp.Links.length);
		if(Cp.Type == 'Hull' && Cp.Stats.Heat['Level'] > 0.0) { Cp.Stats.Heat['Level'] -= (6 - Cp.Links.length) * 0.02 * (Cp.Stats.Heat['Level']); // bleeds excess heat into space (if less than 4 links)
//		console.log( 'DeltaHeat: '+ ((4 - Cp.Links.length) * 0.2 * Cp.Stats.Heat['Level']) );
			}
	Cp.Stats.Energy['Level'] = Cp.Stats.Energy['Update'];
 
	if(Cp.Stats.Energy['Level'] > 1.0) 
		{ Cp.Stats.Heat['Level'] += (Cp.Stats.Energy['Level'] - 1.0)/2; Cp.Stats.Energy['Level'] -= (Cp.Stats.Energy['Level'] - 1.0)/2} // should convert excess energy into heat

	if(Cp.Type == 'PowerSupply') 
		Cp.Stats.Energy['Level'] += 0.4;

	SumE += Cp.Stats.Energy['Level']; 

	Cp.Stats.O2['Level'] = Cp.Stats.O2['Update']; 
		if(Cp.Type == 'OxygenGen' && Cp.Stats.Energy.Level > 0.1) {Cp.Stats.O2['Level'] = Math.min(1.0, (Cp.Stats.O2['Level'] +0.5)); Cp.Stats.Energy.Level -= 0.05; Cp.Stats.Heat.Level += 0.05}
		if(Cp.Type == 'System' && Cp.Stats.Energy.Level > 0.1 && Cp.Stats.O2.Level > 0.01) { Cp.Stats.Energy.Level -= 0.1; Cp.Stats.Heat.Level += 0.1; Cp.Stats.O2.Level -= 0.01;  this.SystemsActive++;}
		if(Cp.Type == 'System') {TotalSystems++;}
		if(Cp.Stats.Heat['Level'] > 1.0) { Cp.Stats.Armour -= (Cp.Stats.Heat['Level'] - 1.0)/4; Cp.Stats.Heat['Level'] -= (Cp.Stats.Heat['Level'] - 1.0)/4; }
	SumO2 += Cp.Stats.O2['Level']; 
	SumH += Cp.Stats.Heat['Level'];
	Cp.Stats.Energy['Update'] = 0; // reset the update for next tick
	Cp.Stats.O2['Update'] = 0; // reset the update for next tick
	Cp.Stats.Heat['Update'] = 0; // reset the update for next tick
	}
for(var i = 0; i< this.Components.length; i++)
	{ 
	if(this.Components[i].Stats.Armour <= 0.0) 
		{
		 this.Components[i].BreakLinks();
		 this.Components.splice(i,1);  
		}	
	}
	AverageO2 = SumO2 / this.Components.length;
	AverageEnergy = SumE / this.Components.length;
	AverageHeat = SumH / this.Components.length;
	}

 var AvgText = 'Avg O2 lvl: ' + Math.round(AverageO2*100)+'%'; // update the O2 avg counter.
 AvgText += ' Avg Energy lvl: ' + Math.round(AverageEnergy*100)+'%';
 AvgText += ' Avg Heat lvl: ' + Math.round(AverageHeat*100)+'%'
 AvgText += ' Sys Active: '+this.SystemsActive + '/' + TotalSystems;
 $('#SimData').text(AvgText);
 this.ReDrawComponents();
}

var ShipComponent = function(x,y,z,Type,Ship)
{
	this.x = x;
	this.y = y;
	this.z = z;
	this.Type = Type;
// types: red, yellow, blue -
/* (human) space, system (weapon, shield, heat sink, cloak, thrust, warpdrive, power supply), power (rating), armour  */
	this.Stats = this.InitStats(Type); 
	this.Ship = Ship; 
	this.Links = new Array();
	this.FindLinks();
}

ShipComponent.prototype.Move = function(x,y,z)
{
	this.x = x;
	this.y = y;
	this.z = z;
	this.BreakLinks();
	this.FindLinks();
}

ShipComponent.prototype.InitStats = function(Type)
{
switch(Type)
 {
	case 'Room':		return {"O2": {"Level": 0.5, "Update":0.0, "Rate":0.98},
								"Energy": {"Level": 0.0, "Update": 0.0, "Rate": 0.30 },
								"Heat": {"Level": 0.4, "Update": 0.0, "Rate": 0.40},
								"Armour": 0.1, "BgImage": "url(./pix/Room.png)"}; // Internal Ship Space

	case 'Hull': 		return {"O2": {"Level": 0.0, "Update":0.0, "Rate":0.01},
								"Energy": {"Level": 0.0, "Update": 0.0, "Rate": 0.99 },
								"Heat": {"Level": 0.2, "Update": 0.0, "Rate": 0.80},
								"Armour": 0.9, "BgImage": "url(./pix/Hull.png)"}; // Hull

	case 'System':		return {"O2": {"Level": 0.0, "Update":0.0, "Rate":0.88},
								"Energy": {"Level": 0.0, "Update": 0.0, "Rate": 0.30 },
								"Heat": {"Level": 0.2, "Update": 0.0, "Rate": 0.50},
								"Armour": 0.1, "BgImage": "url(./pix/System.png)"}; // System

	case 'OxygenGen': 	return {"O2": {"Level": 1.0, "Update":0.0, "Rate":0.99},
								"Energy": {"Level": 0.0, "Update": 0.0, "Rate": 0.30 },
								"Heat": {"Level": 0.2, "Update": 0.0, "Rate": 0.60},
								"Armour": 0.1, "BgImage": "url(./pix/OxygenGen.png)"}; // O2 generator

	case 'PowerSupply': return {"O2": {"Level": 0.0, "Update":0.0, "Rate":0.78},
								"Energy": {"Level": 1.0, "Update": 0.0, "Rate": 0.1 },
								"Heat": {"Level": 0.2, "Update": 0.0, "Rate": 0.60},
								"Armour": 0.1, "BgImage": "url(./pix/PowerSupply.png)"}; // Power Unit

	default: 			return {"O2": {"Level": 0.0, "Update":0.0, "Rate":0.0},
								"Energy": {"Level": 0.0, "Update": 0.0, "Rate":0.0 },
								"Heat": {"Level": 0.0, "Update": 0.0, "Rate":0.0},
								"Armour": 0.01, "BgImage": "rgb(0,0,0)"};
 }
}

/**  Links used to connect O2, Heat and Power, each component type needs a rate of transfer to it's neighbours. **/
ShipComponent.prototype.FindLinks = function()
{ var CompArray = this.Ship.Components; 
  this.Links.length = 0; /**To reset the Links array to 0 elements**/
	for(var i=0, l = CompArray.length; i<l ; i++)
	 {
	  if(CompArray[i] !== this) { 
			if( (Math.abs(CompArray[i].x -this.x)+Math.abs(CompArray[i].y -this.y)+Math.abs(CompArray[i].z-this.z)) == 1)  { 
	this.Links.push(CompArray[i]); CompArray[i].Links.push(this)
			}
		}
	}
}

ShipComponent.prototype.BreakLinks = function()
{ 
	for(var i=0; i < this.Links.length; i++)
	{for(var j=0; j < this.Links[i].Links.length; j++) 
		{
			if(this.Links[i].Links[j] == this) {this.Links[i].Links.splice(j,1); j=this.Links[i].Links.length+1;} 
			//console.log('breaking '+i+' '+j);
		}
	}
	this.Links.length = 0;
}


ShipComponent.prototype.Draw = function(Fragment, i, z)
{	
	var Bg = this.Stats.BgImage; var MyType = '';
	if(this.Ship.ColourMap !== 'none') { Bg = this.ColourMapping(this.Stats[this.Ship.ColourMap].Level);  } else {MyType = this.Type}
//console.log(Bg);
	var ToAdd = $('<div></div>').attr('id','Component'+i).addClass('ShipElement '+MyType).css({'top':(this.y*20)+'px','left':(this.x*20)+'px', 'z-index':z, 'opacity':  Math.pow(0.5, -z),'background-color':Bg });
		Fragment.appendChild(ToAdd[0]); // [0] <- this grabs the DOM element which is inside the jquery wrapper.
	return Fragment;
}

ShipComponent.prototype.ColourMapping = function(val)
 { //console.log(val); // 0,0,0 -> 0,0,255 -> 0,255,255 -> 0,255,0 -> 255,255,0 -> 255,0,0 && 255,255,255
 var ToReturn; val *= 100;
 var mod = val%20;
 var div = (val - mod) / 20;
 var delta = Math.round(mod * 255 / 20);
	switch(div) 
	{
		case 0: ToReturn = 'rgb(0,0,'+delta+')'; break;
		case 1: ToReturn = 'rgb(0,'+delta+',255)'; break;
		case 2: ToReturn = 'rgb(0,255,'+(255 - delta)+')'; break;
		case 3: ToReturn = 'rgb('+delta+',255,0)'; break;
		case 4: ToReturn = 'rgb(255,'+(255 -delta)+',0)'; break;

		default: ToReturn = 'rgb(255,255,255)'; break;
	} //console.log(ToReturn);
	 return ToReturn;
}

ShipComponent.prototype.GetLinkLoss = function(stat)
{ var Sum = 0, MyLevel =this.Stats[stat]['Level'];
	for(var i =0, l=this.Links.length; i<l; i++) 
		{
			Leak = MyLevel*this.Links[i].Stats[stat]['Rate']/l;
			this.Links[i].Stats[stat]['Update'] += Leak;
			Sum += Leak;
		}
 return Sum; // 6 for maximum number of connections // should be 4 for 2D ships.
}
