 $(document).ready(function ()
	{
	//** default page selection **//
	var Get = ''; 
	if(location.hash == '') { location.hash = '#SpacePort'; Get = 'SpacePort'; }
	else { Get = location.hash.replace('#',''); }
	$.ajax(
	   {
		url: "./content.php?tab=" + Get,
		beforeSend: function() {$("#loading").show();},
		success:function(data) { evalJSON(data); $("#loading").hide(); $("#"+Get).show(); }
	   }
	  ); //** END OF default page selection**//

 // Should be using event delegation - one top level event for this. Or should i? One event always triggered has performance issues...//Note: Delegated events do not work for SVG.
//** TopTab Menu Selection **//
$('div#TopTab').on('click', 'input', function(event, keycode){
//		console.log( 'key ' + event.which + ' tagName'+event.target.tagName + ' keycode: ' + keycode)
		if(event.which === undefined && keycode !== undefined) event.which = keycode;  // keycode is passed for by trigger for to correctly simulate events.
		switch(event.which) // should i be using event.type?, may need to do something with the 'trigger' workaround. 
		{// loops through items in menu - forward for tab, backwards for shift tab.
		case 1: // left click		
			switch(event.target.tagName.toLowerCase())
			{
			 case 'input': 	//** MENU button ajax**//
			 var get = event.target.name; var tab = $(event.target).val();
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
					if(data.indexOf('id=login') == -1)
					{ evalJSON(data);
					$("#loading").hide();
					$("#"+tab).show(); // content arrives hidden, then this sets the display 
					}
					else 
					{ $("#PageContainer").html(data); } // for login page only!
				  } 
				 });  
			    } // ** end of else** //
				
			break;
			default: console.log(' default left click triggered ');
			}
		break;
		}
		
	}); //** END of TopTab Menu Selection **//

$('span#GetOptions').on('click', function(event){console.log('clicked Get Options ')} );
$("#PageContainer").on('click','div.CloseButton',function() {$(this).parent().hide(200)});


	// **Keybindings ** //
	$(document).keydown(function(key){ switch(key.which) 
						{
						//	case 16: ShiftDown = true; break; // shift
						//	case 9 : key.preventDefault(); break; // tab
						//	default : console.log(key.which); break;
						}
				} );
	$(document).keyup(function(key){ 
						var i = Menu.indexOf(Get);
						switch(key.which)
						{// loops through items in menu - forward for tab, backwards for shift tab. 
						//NB: passes an extra keycode parameter to the trigger - to specify how the triggered event should handle this - the event passed doesn't contain this
							case 37 : j = Menu.length-1; i--; if(i > j) i = 0; else if(i<0) i = j;var toGet = Menu[i]; //alert('get '+toGet+ ' i:' +i);
							$('#Menu'+toGet).trigger('click', 1);	
							break; // leftup 
							case 39 : j = Menu.length-1; i++; if(i > j) i = 0; else if(i<0) i = j;var toGet = Menu[i]; //alert('get '+toGet+ ' i:' +i);
							$('#Menu'+toGet).trigger('click', 1);
							break; // rightup
						//	case 16: ShiftDown = false; break; 	
						}
				}); // **END of Keybindings ** //

}); //**END of document.ready**//

function evalJSON(data){// console.log(data);
	node = JSON.parse(data); //console.log('node: '+node+' nodeArray '+nodeArray); /*Note, JSON data should include a node array.*/
	for(var i = 0, l=node.length ; i < l; i++)
		{ var tag = jsonToHtml(node[i]); if(tag) $("#PageContainer").append(tag);} /*where to attach could be contained in the JSON*/
	}
function jsonToHtml(node){
	if(node.tn != 'script')
	{	/*Should I be using a documentfragment? would be nice, even for recursive?*/
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
	try{		if(node.attr.js) { eval(node.attr.js); }  } catch(err) {console.log(err+ ' '+node.attr.js)}
	}
};
