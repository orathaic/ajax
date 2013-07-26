function ChangeTab(iID)
{
if(iID == '') { iID = location.hash.replace('#','');} else { location.hash = '#'+iID}
//alert('url-hash is: '+location.hash+'\n iID is: ' +iID  );
ShowOnly(iID);
}

function ToggleHide(iId)
{ //alert('toghide '+iId);
 if(document.getElementById(iId).style.display=='block')
  {document.getElementById(iId).style.display='none'; }
  else
  { document.getElementById(iId).style.display='block'; }
}

function ShowOnly(iId)
{ var change = false;
var node = document.getElementById('Parent');
	var tags=node.getElementsByTagName("*");
	for (i=0; i<tags.length; i++)
	{
		if (tags[i].className=='content hidden') 
 		{ 
			if(tags[i].id==iId)
			{tags[i].style.display='block'; change = true;}
			else tags[i].style.display='none';

 		}
 	} 
 //if(!change) // call get div - create a div for this element and then add it via ajax.
}

var ShipDesign = function (Name)
{
	this.DesignName = Name;
	this.Components = [];//new array(new array(new array())); // 3-d array, x,y,z - 
	this.Canvas = $("#DesignCanvas");
}

ShipDesign.prototype.AddComponent = function(x,y,z,Type)
	{
	this.Components.push(new ShipComponent(x,y,z,Type,this)); 
	 //alert('new ('+Type+') component added to '+this.DesignName);
	}

ShipDesign.prototype.ReDrawComponents = function(z) 
	{
	 this.Canvas.empty();
	 for(var i =0; i < this.Components.length; i++)
	 {
	  if(this.Components[i].z == z) { this.Components[i].Draw(this.Canvas, i); };  
	 }
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
}
/**  Links used to connect O2, Heat and Power, each component type needs a rate of transfer to it's neighbours. **/
ShipComponent.prototype.FindLinks = function()
{ var CompArray = this.Ship.Components; 
  this.Links.length = 0; /**To reset the Links array to 0 elements**/
	for(var i=0; i< CompArray.length; i++)
	 {
	  if(CompArray[i] !== this) { 
			if( (Math.abs(CompArray[i].x -this.x)+Math.abs(CompArray[i].y -this.y)+Math.abs(CompArray[i].z-this.z)) == 1)  { 
	this.Links.push(CompArray[i]); CompArray[i].Links.push(this)
			}
		}
	}
}

ShipComponent.prototype.Draw = function(Canvas, i)
{
	var ToAdd = $('<div></div>').css({'position':'absolute','top':(this.y*20)+'px','left':(this.x*20)+'px','background-color':this.Type,'height':'20px','width':'20px'});
//	ToAdd.attr('id', 'Component'+i);
	$(ToAdd).click(function(){ ObjDesign.Components[i].SetGreen();   });
	Canvas.append(ToAdd);
}

ShipComponent.prototype.SetGreen = function() // inspired by noted actor Seth Green, this function should only be needed for debugging.
{	if(this.Type != 'rgb(0, 255, 0)') var call = true; 
	this.Type = 'rgb(0, 255, 0)';
	if(call) for(var j = 0; j < this.Links.length; j++ ){this.Links[j].SetGreen();}
	this.Ship.ReDrawComponents(this.z);
	
}
