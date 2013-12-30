/*### Example from CW to post a form, serialized form data - uses Jquery### */

// $(window).on('hashchange', function(){ console.log('jQuery hashchange')}) // ??

//** Console/SpacePort Menu Selection  most of this should be moved! **//
/* $('div#console').on('click', $('input').add('span'), function(event, keycode){ //		console.log( 'key ' + event.which + ' tagName'+event.target.tagName + ' keycode: ' + keycode)
		if(event.which === undefined && keycode !== undefined) event.which = keycode;  // keycode is passed for by trigger for to correctly simulate events.
		switch(event.which) // should i be using event.type?, may need to do something with the 'trigger' workaround. 
		{// loops through items in menu - forward for tab, backwards for shift tab.
		case 1: // left click		
			switch(event.target.tagName.toLowerCase())
			{
			 case 'span':
				if((event.target).id == 'OpenMenu')
				{
					tab = 'SpacePort'; 
				}
				else {break;}
				Client.ChangeTo(tab); console.log('ChangeTab has been replaced with Client.ChangeTo'); 
				break;
			 case 'input': */	//** MENU button ajax**//
/*			 var tab = event.target.name;
			 ChangeTab(tab);
			break;
			default: console.log(' default left click triggered ');
			}
		break;
		}
		
	}); */	//** END of TopTab Menu Selection **//

/*
var totalTime = 0;

function TestTime() {

var hz, runs = 0;
    startTime = new Date;

var IntervalTimer=setInterval( function(){ObjDesign.Simulate(); runs++; totalTime = new Date - startTime; 
											if(totalTime > 10000) {clearInterval(IntervalTimer); totalTime /= 1000;

																	// period → how long per operation
																	period = totalTime / runs;

																	// hz → the number of operations per second
																	hz = 1 / period;

																	console.log("frequency:" +hz+' total runs '+runs);
																	return true;
																	} return false;
							}, 40);

}*/

var ShipDesign = function (Name)
{
	this.DesignName = Name;
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

ShipDesign.prototype.Simulate = function() 
{ $('#SimData').show()
 var AverageO2 =0, AverageEnergy = 0, AverageHeat = 0, TotalSystems; 
 for(var k =0; k<10; k++)
 { 
 var SumO2 =0, SumE =0; SumH =0; this.SystemsActive = 0; TotalSystems = 0;
 for(var i = 0; i< this.Components.length; i++)
	{ var Cp = this.Components[i]; 
	 Cp.Stats.Energy['Update'] += Cp.Stats.Energy['Level'] - Cp.GetLinkLoss('Energy', Cp.Stats.Energy['Level']);
	 Cp.Stats.Heat['Update'] += Cp.Stats.Heat['Level'] - Cp.GetLinkLoss('Heat', Cp.Stats.Heat['Level']);
	 Cp.Stats.O2['Update'] += Cp.Stats.O2['Level'] - Cp.GetLinkLoss('O2', Cp.Stats.O2['Level']);
	}
 for(var i = 0; i< this.Components.length; i++)
	{ var Cp = this.Components[i];
	 Cp.Stats.Heat['Level'] = Cp.Stats.Heat['Update']; //console.log(Cp.Links.length);
		if(Cp.Type == 'Hull' && Cp.Stats.Heat['Level'] > 0.0) { Cp.Stats.Heat['Level'] -= (4 - Cp.Links.length) * 0.02 * (Cp.Stats.Heat['Level']); // bleeds excess heat into space (if less than 4 links)
//		console.log( 'DeltaHeat: '+ ((4 - Cp.Links.length) * 0.2 * Cp.Stats.Heat['Level']) );
			}
	 Cp.Stats.Energy['Level'] = Cp.Stats.Energy['Update'];
 
		if(Cp.Stats.Energy['Level'] > 1.0) { Cp.Stats.Heat['Level'] += (Cp.Stats.Energy['Level'] - 1.0)/2; Cp.Stats.Energy['Level'] -= (Cp.Stats.Energy['Level'] - 1.0)/2} // should convert excess energy into heat

		if(Cp.Type == 'PowerSupply') Cp.Stats.Energy['Level'] += 0.4;

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
	{ if(this.Components[i].Stats.Armour <= 0.0) { this.Components[i].BreakLinks(); this.Components.splice(i,1);  }	}
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
	case 'Room':		return {"O2": {"Level": 0.0, "Update":0.0, "Rate":0.98},
								"Energy": {"Level": 0.0, "Update": 0.0, "Rate": 0.80 },
								"Heat": {"Level": 0.4, "Update": 0.0, "Rate": 0.40},
								"Armour": 0.1, "BgImage": "url(./pix/Room.png)"}; // Internal Ship Space

	case 'Hull': 		return {"O2": {"Level": 0.0, "Update":0.0, "Rate":0.05},
								"Energy": {"Level": 0.0, "Update": 0.0, "Rate": 0.99 },
								"Heat": {"Level": 0.2, "Update": 0.0, "Rate": 0.80},
								"Armour": 0.9, "BgImage": "url(./pix/Hull.png)"}; // Hull

	case 'System':		return {"O2": {"Level": 0.0, "Update":0.0, "Rate":0.88},
								"Energy": {"Level": 0.0, "Update": 0.0, "Rate": 0.30 },
								"Heat": {"Level": 0.2, "Update": 0.0, "Rate": 0.50},
								"Armour": 0.1, "BgImage": "url(./pix/System.png)"}; // System

	case 'OxygenGen': 	return {"O2": {"Level": 0.0, "Update":0.0, "Rate":0.99},
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

ShipComponent.prototype.GetLinkLoss = function(stat, MyLevel)
{ var Sum = 0;
	for(var i =0, l=this.Links.length; i<l; i++) 
		{
			Leak = MyLevel*this.Links[i].Stats[stat]['Rate'];
			this.Links[i].Stats[stat]['Update'] += Leak/6;
			Sum += Leak;
		}
 return Sum/6; // 6 for maximum number of connections // should be 4 for 2D ships.
}

