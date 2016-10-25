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

	this.CapacitorSets = []; //array of capacitor objects (each a set linked hull capacitors).
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
	if(jQButton.val() =='Rename') 
	{		
		jQButton.attr('type','text').val($("#NameHeader").text());
		jQButton.on('keydown.renameform', function(event)
		{ //console.log(event+' '+event.which);
			if(event.which == 13) 
			{ //console.log('13 '+this.value); // 13 is enter.
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
		case 'RubbishBin' : this.ToPlace = 'Remove'; break;
		default: this.ToPlace = 'none';
		} //console.log(this.ToPlace);
}

ShipDesign.prototype.ColourMapTo = function (ToSet)
{
	if(this.ColourMap != ToSet ) 
			this.SetColourMap(ToSet);
		else
			this.SetColourMap("none");
		this.ReDrawComponents();
}

ShipDesign.prototype.SetColourMap = function(Stat) { this.ColourMap = Stat;}

ShipDesign.prototype.MultiAddComponents = function(ComponentArray)
{
	for(var i=0,l=ComponentArray.length; i < l; i++)
		{
		var Cp = ComponentArray[i];
		this.AddComponent(Cp.x,Cp.y,Cp.z,Cp.Type);
		}
}

ShipDesign.prototype.AddComponent = function(x,y,z,Type) 
{ 
	var i = this.CheckDuplicate(x,y,z);
	if(i != false || i === 0 ) {
		this.Components[i].Type = Type; 
		this.Components[i].InitStats(Type); 
		return;
		}														
	else return this.Components.push(new ShipComponent(x,y,z,Type,this));
	}

ShipDesign.prototype.MoveComponent = function(x,y,z,id)
{ 
	var i = this.CheckDuplicate(x,y,z);
	if(i != false || i === 0 )
	{return; }
	else this.Components[id].Move(x,y,z); 
}

ShipDesign.prototype.CheckDuplicate = function(x,y,z) 
{
	for(var i=0, l=this.Components.length; i<l; i++)
	{if (this.Components[i].x == x && this.Components[i].y == y && this.Components[i].z == z ) 
		{
		 return i;
		}

	}
 return false;
}

ShipDesign.prototype.RemoveCompomentByLoc = function(x,y,z)
{ //console.log('x: '+x +' y: ' + y +' z: '+z);
	for(var i=0, l=this.Components.length; i<l; i++)
	{	
		if(this.Components[i].x == x && this.Components[i].y == y && this.Components[i].z == z)
		{
			//console.log('removing i: '+i);
			var Cp = this.Components[i];
			Cp.BreakLinks();
			this.Components.splice(i,1); 
			if(Cp.Type === "Hull") { this.GenerateCapacitorSets(); }
			this.ReDrawComponents();
			break;
	    }
	}
}

ShipDesign.prototype.ChangeZed = function(Direction) 
{ 
		if(Direction > 0) {Client.ObjDesign.Zed++;} 
		else if(Direction < 0 ) {Client.ObjDesign.Zed--;}
		Client.ObjDesign.ReDrawComponents();
}

ShipDesign.prototype.ReDrawComponents = function() 
{
	var z = this.Zed;
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

ShipDesign.prototype.EnableEditMode = function(Caller) 
{
	if(!Client.hasOwnProperty('ObjDesign') ) { Client.ErrorOutput('Nothing to edit, please try creating a new design.'); console.log(' no object'); return} else
	
	if( Caller.EditMode !== true)
	{	
		Caller.EditMode = true;	
		$('#DesignManager').hide(100);
		$('#DesignTesting').show(100);
		$(".DesignUnit", "#Design").attr("draggable","true");
		$(".Dragable").on('click.design', function(event){ Caller.PlaceMode(event.target.id); $("div#DesignCanvas").css("cursor", $(event.target).css("background-image")+",auto" ) } );
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
				Caller.AddComponent( (left/20),(top/20),Client.ObjDesign.Zed,$("#"+data).attr("id") );
				Caller.ReDrawComponents();
			}
			else if( $("#"+data).hasClass("ShipElement") )
			{
				Caller.MoveComponent( (left/20),(top/20),Client.ObjDesign.Zed,$("#"+data).attr("id").replace("Component","") ); 
				Caller.ReDrawComponents();
			}
		});
		$(".DropTarget", "#Design").on("dragover.design", function (event){event.preventDefault();});
		$(".DropTarget", "#Design").on('click.design', function(event) { //console.log(Caller.ToPlace);
			var top = event.originalEvent.pageY, left = event.originalEvent.pageX; 
			top = top - $("#DesignCanvas").offset().top + 10; left = left - $("#DesignCanvas").offset().left + 10;
			top = top - top%20; left = left - left%20;
			if( Caller.ToPlace !== 'none' && Caller.ToPlace !== 'Remove')
			{ Caller.AddComponent( (left/20),(top/20),Caller.Zed,Caller.ToPlace ); }
			else if(Caller.ToPlace === 'Remove') Caller.RemoveCompomentByLoc((left/20),(top/20),Caller.Zed);
			Caller.ReDrawComponents();
		});
		$('#EditDesign').attr("value", "\u0298");
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
}

ShipDesign.prototype.DisableEditMode = function(Caller) 
{
	Caller.EditMode = false;
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
	$('#EditDesign').attr("value", "Edit Design");
}

ShipDesign.prototype.TestDesign = function(Button)
{
	if( Button.attr("value") == "Test Design")
	 { IntervalTimer=setInterval( function(){Client.ObjDesign.Simulate()}, 400); Button.attr("value","Stop Testing"); }
	else if (Button.attr("value") == "Stop Testing")
	 { clearInterval(IntervalTimer); Button.attr("value","Test Design"); }
//	Client.ObjDesign.Simulate();
}

ShipDesign.prototype.Simulate = function() 
{
	 $('#SimData').show();
	$('#CapaictorHud').show();
	 var AverageO2 =0, AverageEnergy = 0, AverageHeat = 0, TotalSystems; 	

	 for(var k =0; k<10; k++) // k cycles per frame
	 { 
		var SumO2 =0, SumE =0; SumH =0, this.SystemsActive = 0, TotalSystems = 0; 
		for(var i = 0; i< this.Components.length; i++)
		{
			var Cp = this.Components[i]; 
			if(Cp.Type == 'Hull') { Cp.Stats.Energy['Level'] = (Cp.CapacitorSet.CurrentCapacitor / Cp.CapacitorSet.MaxCapacitor);}
			 //Cp.Stats.Energy['Update'] += Cp.Stats.Energy['Level'] - Cp.GetLinkLoss('Energy');
			 Cp.Stats.Heat['Update'] += Cp.Stats.Heat['Level'] - Cp.GetLinkLoss('Heat');
			 Cp.Stats.O2['Update'] += Cp.Stats.O2['Level'] - Cp.GetLinkLoss('O2');
		}

	for(var i = 0, l=this.CapacitorSets.length; i<l; i++)
		{
			this.CapacitorSets[i].UpdateCapacitor = this.CapacitorSets[i].CurrentCapacitor;
		}

		for(var i = 0; i< this.Components.length; i++)
		{
			var Cp = this.Components[i];

			Cp.Stats.Heat['Level'] = Cp.Stats.Heat['Update']; 
			Cp.Stats.O2['Level'] = Cp.Stats.O2['Update']; 

			if(Cp.Type == 'Hull' && Cp.Stats.Heat['Level'] > 0.0) 
			{
				Cp.Stats.Heat['Level'] -= (6 - Cp.Links.length) * 0.02 * (Cp.Stats.Heat['Level']); // bleeds excess heat into space (if less than 4 links)
			}

			if(Cp.Type == 'PowerSupply') { Cp.DistributePower(); }

			if(Cp.Type == 'System' || Cp.Type == 'OxygenGen') { Cp.UtilisePower(i);	}			
				 
			if(Cp.Stats.Energy['Level'] > 1.0) 
				{ Cp.Stats.Heat['Level'] += (Cp.Stats.Energy['Level'] - 1.0)/2; Cp.Stats.Energy['Level'] -= (Cp.Stats.Energy['Level'] - 1.0)/2} //converts excess energy into heat
			

			//moved into utilise energy	if(Cp.Type == 'OxygenGen' && Cp.Stats.Energy.Level > 0.1) {Cp.Stats.O2['Level'] = Math.min(1.0, (Cp.Stats.O2['Level'] +0.5)); Cp.Stats.Energy.Level -= 0.05; Cp.Stats.Heat.Level += 0.05}
			//moved into a function	/*if(Cp.Type == 'System' && Cp.Stats.Energy.Level > 0.1 && Cp.Stats.O2.Level > 0.05) { Cp.Stats.Energy.Level -= 0.1; Cp.Stats.Heat.Level += 0.1; Cp.Stats.O2.Level -= 0.05;  this.SystemsActive++;} */
			if(Cp.Type == 'System' || Cp.Type == 'OxygenGen') {TotalSystems++;}

			if(Cp.Stats.Heat['Level'] > 1.0) 
			{ 
				Cp.Stats.Armour -= (Cp.Stats.Heat['Level'] - 1.0)/4; 
				Cp.Stats.Heat['Level'] -= (Cp.Stats.Heat['Level'] - 1.0)/4;
			}

			SumO2 += Cp.Stats.O2['Level']; 
			SumH += Cp.Stats.Heat['Level'];
			//Cp.Stats.Energy['Update'] = 0; // reset the update for next tick
			Cp.Stats.O2['Update'] = 0; // reset the update for next tick
			Cp.Stats.Heat['Update'] = 0; // reset the update for next tick
		}

		for(var i = 0, l=this.CapacitorSets.length; i<l; i++)
		{
			this.CapacitorSets[i].CurrentCapacitor = this.CapacitorSets[i].UpdateCapacitor;
			this.CapacitorSets[i].UpdateCapacitor = 0;
			//console.log('inner loop vars'+i + ' '+ this.CapacitorSets[i].ComponentArray.length +' ' + l);
			/*for(j = 0, k = this.CapacitorSets[i].ComponentArray.length; j < k; j++)
			{console.log('in inner loop');}*/
		}

		for(var i = 0; i< this.Components.length; i++)
		{ 
			if(this.Components[i].Stats.Armour <= 0.0) 
			{
				var Cp = this.Components[i];
				Cp.BreakLinks();
				this.Components.splice(i,1); 
				if(Cp.Type === "Hull") { this.GenerateCapacitorSets(); }
			}	
		}
		AverageO2 = SumO2 / this.Components.length;
		//AverageEnergy = SumE / this.Components.length;
		AverageHeat = SumH / this.Components.length;
	}
	var CapTotals = {CurrentLvl: 0, MaxLvl: 0}; 
	for(var i = 0, l = this.CapacitorSets.length; i < l; i++) 
		{
		 CapTotals.CurrentLvl += this.CapacitorSets[i].CurrentCapacitor;
		 CapTotals.MaxLvl += this.CapacitorSets[i].MaxCapacitor;
		}
	var AvgText = 'Avg O2 lvl: ' + Math.round(AverageO2*100)+'%'; // update the O2 avg counter.
	//AvgText += ' Avg Energy lvl: ' + Math.round(AverageEnergy*100)+'%';
	AvgText += ' # of cap sets: ' + this.CapacitorSets.length;
	AvgText += ' Cap totals: ' + Math.round(CapTotals.CurrentLvl) +'/'+CapTotals.MaxLvl;
	AvgText += ' Avg Heat lvl: ' + Math.round(AverageHeat*100)+'%'
	AvgText += ' Sys Active: '+this.SystemsActive + '/' + TotalSystems;
	$('#SimData').text(AvgText);
		var CapPercentage = Math.round(CapTotals.CurrentLvl / CapTotals.MaxLvl );
	$('#MeterMask').height( (1 - CapPercentage) * 76);
	this.ReDrawComponents();
}


ShipDesign.prototype.GenerateCapacitorSets = function()
{ //console.log('[GenerateCapacitorSets]');
	this.CapacitorSets = []; // this didn't fix the capacitor bug... 
//don't *really* want to wipe all the cap sets
	for(var i = 0; i< this.Components.length; i++)
		{ this.Components[i].CapacitorSet = null; }
 
	if(this.Components[0].Type == 'Hull')
	{
		this.Components[0].CapacitorSet = new CapacitorSet(this.Components[0]);
		this.CapacitorSets.push(this.Components[0].CapacitorSet); 
	}
	for(var i = 1; i< this.Components.length; i++)
		{ 
			this.Components[i].CapacitorSet = this.Components[i].FindCapacitorSet();
		}
}
/*  // in case of performance issues, this can be used to reduce the work done generating capacitors sets. 
// This function only regenerates the set belonging to the removed Cp; rather than generating all sets.
ShipDesign.prototype.RemoveAndRegenerateCapacitorSets = function(Cp) {

	SelectCapacitorSet = Cp.CapacitorSet;
	console.log('[RemoveAndRegenerateCapacitorSets]');
	console.log(SelectCapacitorSet);

	for(i=0, l=SelectCapacitorSet.ComponentArray.length; i<l; i++)
	{
		SelectCapacitorSet.ComponentArray[i].CapacitorSet = null;
	}

	SelectCapacitorSet.ComponentArray.splice(SelectCapacitorSet.ComponentArray.indexOf(Cp),1); // remove element 'a' from it's cap set.
	this.CapacitorSets.splice(this.CapacitorSets.indexOf(SelectCapacitorSet),1); // and remove the cap set from the ship.

	//console.log(SelectCapacitorSet.ComponentArray.length);

	for(i=0, l=SelectCapacitorSet.ComponentArray.length; i<l; i++)
	{ 
		SelectCapacitorSet.ComponentArray[i].CapacitorSet = SelectCapacitorSet.ComponentArray[i].FindCapacitorSet();
	}
	
}*/

ShipDesign.prototype.ListCapacitorSets = function() // for debugging
{	var tolog = 'Capacitor sets: '+this.CapacitorSets.length+ ':\n';
	for(var i = 0, l = this.CapacitorSets.length; i < l; i++)
		{
		 tolog += '#'+ this.CapacitorSets[i].ComponentArray.length +' ' + this.CapacitorSets[i].CurrentCapacitor+'/'+this.CapacitorSets[i].MaxCapacitor+'\n';

		}
		 this.ColourMap = 'CapacitorSet'; 
		 this.ReDrawComponents();
	console.log(tolog);
return true;
}

ShipDesign.prototype.ListCapacitorConnections = function() // for debugging
{	var tolog = 'Capacitor Connections: :\n';
	for(var i = 0, l = this.Components.length; i<l; i++)
		{ if( this.Components[i].Type == 'PowerSupply') 
			tolog += this.Components[i].Type + ' #'+ this.Components[i].GetNoOfCapacitorConnections() +'\n'}
	console.log(tolog);
return true;
}

var CapacitorSet = function (FirstComponent) 
{
	this.ComponentArray = new Array(FirstComponent);
	this.Ship = FirstComponent.Ship;
	this.MaxCapacitor = this.ComponentArray.length * 1; //(1 is max energy per square)
	this.CurrentCapacitor = 0; // should be derived from the first component's current energy..
	this.UpdateCapacitor = 0;
	return this;
}

CapacitorSet.prototype.MergeCapicatorSets = function(MergingComponent) 
{	

	//if(this.Ship.CapacitorSets.indexOf(this) === -1) {console.log('-1'); this.Ship.CapacitorSets.push(this)}

	if(MergingComponent.CapacitorSet === null)
	{var MergingSet = new CapacitorSet(MergingComponent);}
	else {var MergingSet = MergingComponent.CapacitorSet;}

//    var toLog = '[CapicitorSet Merging]. \n splicing '+ this.ComponentArray.length + '+' + MergingSet.ComponentArray.length;


	this.MaxCapacitor += MergingSet.MaxCapacitor;
	this.CurrentCapacitor += MergingSet.CurrentCapacitor;
	for(var i=0, l = MergingSet.ComponentArray.length; i<l; i++)
	{
		this.ComponentArray.push( MergingSet.ComponentArray[i] );  
		MergingSet.ComponentArray[i].CapacitorSet = this;
	}
	this.Ship.CapacitorSets.splice(this.Ship.CapacitorSets.indexOf(MergingSet),1); 

//	toLog += ' = '+ this.ComponentArray.length;
/* Debug output//	console.log(toLog);
	// this.Ship.ColourMap = 'CapacitorSet'; 
	// this.Ship.ReDrawComponents(); */
}

var ShipComponent = function(x,y,z,Type,Ship)
{
	this.x = x;
	this.y = y;
	this.z = z;
	this.Type = Type;
// types: red, yellow, blue -
/* (human) space, system (weapon, shield, heat sink, cloak, thrust, warpdrive, power supply), power (rating), armour  */
	this.Ship = Ship;
	this.Links = new Array();
	this.FindLinks();
	this.Stats = this.InitStats(Type); 

	this.CapacitorSet = this.FindCapacitorSet();
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
									"Energy": {"Level": 0.0, "Update": 0.0, "Need": 0.0 },
									"Heat": {"Level": 0.4, "Update": 0.0, "Rate": 0.30},
									"Armour": 0.1, "BgImage": "url(./pix/Room.png)"}; // Internal Ship Space

		case 'Hull': 		return {"O2": {"Level": 0.0, "Update":0.0, "Rate":0.01},
									"Energy": {"Level": 0.0, "Update": 0.0, "Need": 0.0 },
									"Heat": {"Level": 0.2, "Update": 0.0, "Rate": 0.80},
									"Armour": 0.9, "BgImage": "url(./pix/Hull.png)"}; // Hull

		case 'System':		return {"O2": {"Level": 0.0, "Update":0.0, "Rate":0.88},
									"Energy": {"Level": 0.0, "Update": 0.0, "Need": 0.1 },
									"Heat": {"Level": 0.2, "Update": 0.0, "Rate": 0.50},
									"Armour": 0.1, "BgImage": "url(./pix/System.png)"}; // System

		case 'OxygenGen': 	return {"O2": {"Level": 1.0, "Update":0.0, "Rate":0.94},
									"Energy": {"Level": 0.0, "Update": 0.0, "Need": 0.05 },
									"Heat": {"Level": 0.2, "Update": 0.0, "Rate": 0.60},
									"Armour": 0.1, "BgImage": "url(./pix/OxygenGen.png)"}; // O2 generator

		case 'PowerSupply': return {"O2": {"Level": 0.0, "Update":0.0, "Rate":0.78},
									"Energy": {"Level": 1.0, "Update": 0.0, "Need": 0.0 },
									"Heat": {"Level": 0.2, "Update": 0.0, "Rate": 0.60},
									"Armour": 0.1, "BgImage": "url(./pix/PowerSupply.png)"}; // Power Unit

		default: 			return {"O2": {"Level": 0.0, "Update":0.0, "Rate":0.0},
									"Energy": {"Level": 0.0, "Update": 0.0, "Need":0.0 },
									"Heat": {"Level": 0.0, "Update": 0.0, "Rate":0.0},
									"Armour": 0.01, "BgImage": "rgb(0,0,0)"};
	 }
}

/**  Links used to connect O2, Heat and (Power is now connected via capacitor sets - derived from these links), each component type needs a rate of transfer to it's neighbours. **/
ShipComponent.prototype.FindLinks = function()
{ var CompArray = this.Ship.Components; 
  this.Links.length = 0; /**To reset the Links array to 0 elements**/
	for(var i=0, l = CompArray.length; i<l ; i++)
	 {
	  if(CompArray[i] !== this) { 
			if( (Math.abs(CompArray[i].x -this.x)+Math.abs(CompArray[i].y -this.y)+Math.abs(CompArray[i].z-this.z)) == 1) 
			{ 
				this.Links.push(CompArray[i]); CompArray[i].Links.push(this);
			}
		}
	}
}

ShipComponent.prototype.BreakLinks = function()
{ 
	for(var i=0, l = this.Links.length; i<l; i++)
	{for(var j=0, k = this.Links[i].Links.length; j < k; j++) 
		{
			if(this.Links[i].Links[j] == this) {this.Links[i].Links.splice(j,1); j=this.Links[i].Links.length+1;} 
			//console.log('breaking '+i+' '+j);
		}
	}
	this.Links.length = 0;
}

ShipComponent.prototype.FindCapacitorSet = function()
{ //console.log(this.Type);
	if(this.Type != 'Hull') return null;
	else
	{
		var TempCapSet = new CapacitorSet(this);
	 for(var i=0, l = this.Links.length; i<l; i++)
		{ 
		 if(this.Links[i].Type == 'Hull' && this.Links[i].CapacitorSet !== TempCapSet && this.Links[i].CapacitorSet !== null)
			{
				//console.log('Linked to another hull capacitor');
				TempCapSet.MergeCapicatorSets(this.Links[i]);
			}
		} //console.log('pushingto capacitorSets ');console.log(TempCapSet); 
		this.Ship.CapacitorSets.push(TempCapSet); //Debug output - Client.ObjDesign.ListCapacitorSets();
		return TempCapSet;
	}
}

ShipComponent.prototype.Draw = function(Fragment, i, z)
{	
	var Bg = this.Stats.BgImage; var MyType = '';
	if(this.Ship.ColourMap === 'none') {MyType = this.Type;}

	if(this.Ship.ColourMap !== 'none' && this.Ship.ColourMap !== 'CapacitorSet') { Bg = this.ColourMapping(this.Stats[this.Ship.ColourMap].Level); } 

	if(this.Ship.ColourMap === 'Energy' && this.Type == 'Hull') { Bg = this.ColourMapping(this.CapacitorSet.CurrentCapacitor);  } // overwrites the default colouring for capacitors.

	if(this.Ship.ColourMap === 'CapacitorSet' && this.Type == 'Hull') { Bg = this.CapMapping(this.Ship.CapacitorSets.indexOf(this.CapacitorSet)); }
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

ShipComponent.prototype.CapMapping = function(val) // debugging capacitor sets
{
	switch(val)
	{
	 case 0: ToReturn = 'rgb(0,0,255)'; break;
	 case 1: ToReturn = 'rgb(0,0,165)'; break;
	 case 2: ToReturn = 'rgb(0,255,0)'; break;
	 case 3: ToReturn = 'rgb(0,165,0)'; break;
	 case 4: ToReturn = 'rgb(255,0,0)'; break;
	 case 5: ToReturn = 'rgb(165,0,0)'; break;
	 case 6: ToReturn = 'rgb(200,200,200)'; break;
	 case 7: ToReturn = 'rgb(0,255,255)'; break;
	 case 8: ToReturn = 'rgb(0,255,165)'; break;
	 case 9: ToReturn = 'rgb(0,165,165)'; break;
	 case 10: ToReturn = 'rgb(255,255,0)'; break;
	 case 11: ToReturn = 'rgb(165,255,0)'; break;
	 case 12: ToReturn = 'rgb(165,165,165)'; break;

 	 default: ToReturn = 'rgb(255,192,203)'; break;
	}
	return ToReturn;
}

ShipComponent.prototype.GetLinkLoss = function(stat)
{
	 var Sum = 0, MyLevel =this.Stats[stat]['Level'];
		for(var i =0, l=this.Links.length; i<l; i++) 
			{
				Leak = MyLevel*this.Links[i].Stats[stat]['Rate']/6;// 6 for maximum number of connections // should be 4 for 2D ships.
				this.Links[i].Stats[stat]['Update'] += Leak;
				Sum += Leak;
			}
	 return Sum; 
}
ShipComponent.prototype.GetNoOfCapacitorConnections = function()
{ var CapConnections = 0;
	for(var i = 0, l = this.Links.length; i < l; i++)
	{
		if(this.Links[i].CapacitorSet) {CapConnections++; }
	} //console.log( 'Cap connections: '+this.Type+' '+CapConnections);
	return CapConnections;
}

ShipComponent.prototype.DistributePower = function()
{ var sum =0;
	if(this.Type == 'PowerSupply') { 
		for(var i = 0, l = this.Links.length; i < l; i++)
		{
			if(this.Links[i].CapacitorSet) 
			{ this.Links[i].CapacitorSet.UpdateCapacitor += 0.4/ this.GetNoOfCapacitorConnections(); sum += 0.4/ this.GetNoOfCapacitorConnections(); }
		} 
	} //console.log("Distributing: "+sum);
}

ShipComponent.prototype.UtilisePower = function(ElementNumber)
{ var AvailableEnergy = 0;
	if(this.Type == 'System' || this.Type == 'OxygenGen') { 
		for(var i = 0, l = this.Links.length; i < l; i++)
		{
			if(this.Links[i].CapacitorSet) 
			{ AvailableEnergy += this.Links[i].CapacitorSet.CurrentCapacitor; }
		}
		//console.log('('+ElementNumber+')'+ this.Type+' Available energy: '+Math.round(AvailableEnergy*100)+ ' Energy need '+100*this.Stats.Energy.Need);
		if(AvailableEnergy >= 0.1)
		{ //console.log('energy available');
			for(var i = 0, l = this.Links.length; i < l; i++) 
			{
				if(this.Links[i].CapacitorSet) 
				{ 
					this.Links[i].CapacitorSet.UpdateCapacitor -= ( this.Stats.Energy.Need * (this.Links[i].CapacitorSet.CurrentCapacitor / AvailableEnergy) ); }
			}
			this.Stats.Energy.Level += this.Stats.Energy.Need;						
		}

		if( this.Stats.O2.Level > 0.05 && this.Stats.Energy.Level > this.Stats.Energy.Need)
		{  
			this.Stats.Energy.Level -= this.Stats.Energy.Need;	
			this.Stats.Heat.Level += this.Stats.Energy.Need;
			if( this.Type !='OxygenGen') 
				{this.Stats.O2.Level -= 0.01;}
			else {
					this.Stats.O2.Level = Math.min(1.0, (this.Stats.O2.Level +0.5));
				 }
			this.Ship.SystemsActive++;
		}
		//console.log(' Available Energy: '+AvailableEnergy);
	}	
}
