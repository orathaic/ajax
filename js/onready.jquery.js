 $(document).ready(function ()
	{
	//** default page selection **//
	var Get = ''; 
	if(location.hash == '') { location.hash = '#SpacePort'; Get = 'SpacePort'; }
	else { Get = location.hash.replace('#',''); }
	$.ajax(
	   {
		url: "./content.php?tab=" + Get,
		success:function(data) { evalJSON(data); $("#"+Get).show(); }
	   }
	  ); //** END OF default page selection**//

	//** MENU button ajax**//
   $(".toptab input").click(function(event)
	{ var get = this.name; var tab = this.value; 
//		alert('clicked a tab button: '+tab+' #='+$("#"+tab).length+ ' '+ get); // event.relatedTarget.currentTarget
      // change tab, hide others, ajax/unhide desired tab, change location #
     if(tab !='') 
      { if(location.hash != '#'+tab) {location.hash = '#'+tab; Get = tab; }}
	//hide content
        $(".content").hide(); //unhide/ajax get content.value 
   	 if ( $("#"+tab).length != 0)  {$("#"+tab).show();}
		else
		{ 
		$.ajax({url: "./content.php?"+get,
		statusCode: {404: function() {$("#PageContainer").append("<div class='error content' id='"+tab+"'>Error: Tab "+tab+" not found</div>"); }},
		beforeSend: function() {$("#loading").show();},
	 	success:function(data) 
		  {	
			//$(".content").hide(); // this is not needed if all content arrives hidden
			if(data.indexOf('id=login') == -1)
			{ evalJSON(data);
//			$("#PageContainer").append(tag);
//			$("#PageContainer").append(data); // this is deprecated <- use JSONtoHTML to parse content
			$("#loading").hide();
			$("#"+tab).show(); // content arrives hidden, then this sets the display 
			//Extras(); <- download new functions as JSON and eval.
			}
			else 
			{ $("#PageContainer").html(data); } // for login page only!
		  } 
		 }); 
	       } //** end of else**//
	}); //** END OF MENU button ajax**//

	//**Keybindings **//
	$(document).keydown(function(key){ switch(key.which) 
						{
						//	case 16: ShiftDown = true; break; // shift
						//	case 9 : key.preventDefault(); break; // tab
						//	default : console.log(key.which); break;
						}
				} );
	$(document).keyup(function(key){ switch(key.which)
						{// loops through items in menu - forward for tab, backwards for shift tab.
							case 37 : var i = Menu.indexOf(Get); j = Menu.length-1; i--; if(i > j) i = 0; else if(i<0) i = j;var toGet = Menu[i]; //alert('get '+toGet+ ' i:' +i);
							$('#Menu'+toGet).trigger('click');	
							break; // leftup 
							case 39 : var i = Menu.indexOf(Get); j = Menu.length-1; i++; if(i > j) i = 0; else if(i<0) i = j;var toGet = Menu[i]; //alert('get '+toGet+ ' i:' +i);
							$('#Menu'+toGet).trigger('click');	
							break; // rightup
						//	case 16: ShiftDown = false; break; 	
						}
				}); //**END of Keybindings **//

/*	$(document).mousemove(function(event){ 
    $("span").text("X: " + event.pageX + ", Y: " + event.pageY); 
  });
*/
}); //**END of document.ready**//

function evalJSON(data){// console.log(data);
	node = JSON.parse(data); //console.log('node: '+node+' nodeArray '+nodeArray); /*Note, JSON data should include a node array.*/
	for(var i = 0; i < node.length; i++)
		{ tag = jsonToHtml(node[i]); if(tag) $("#PageContainer").append(tag);} /*where to attach could be contained in the JSON*/
	}
function jsonToHtml(node){
	if(node.tn != 'script')
	{
		var tag = document.createElement(node.tn);
		if(node.children) {
		for(var i = 0; i < node.children.length; i++) {
		if(node.children[i].tn == 'text') tag.appendChild(document.createTextNode(node.children[i].text));
		else tag.appendChild(jsonToHtml(node.children[i]));
		 }
		} 
		if(node.attr) {
		 for(var key in node.attr) {
		  tag.setAttribute(key, node.attr[key]);
		 }	 
		}
	return tag;
	}
	else {
		if(node.attr.js) { eval(node.attr.js); }  
		//Extras();
	}
};

//	var ShiftDown = false; // event.shiftKey <- provided by default.

/*	var leftmouseDown = 0; //if not using custom drag this can be removed.
	$(document).mousedown( function(event) { 
	  if(event.which == 1 || (event.which === undefined && event.button == 1))
	  ++leftmouseDown; //console.log('mouse event'+leftmouseDown+' e:'+event.button+ ' m:'+event.which );
	});
	$(document).mouseup( function(event) {
	  if(event.which == 1 || (event.which === undefined && event.button == 1))
	  --leftmouseDown; //console.log('mouse event'+leftmouseDown);
	}); */


