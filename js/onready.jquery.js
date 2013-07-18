 $(document).ready(function ()
	{
	//** default page selection **//
	var Get = ''; 
	if(location.hash == '') { location.hash = '#SpacePort'; Get = 'SpacePort'; }
	else { Get = location.hash.replace('#',''); }
	$.ajax(
	   {
		url: "./content.php?tab=" + Get,
		success:function(data) { $("#PageContainer").append(jsonToHtml(data)); $("#"+Get).show(); }
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
			{ tag = jsonToHtml(data); //console.log(tag);
			$("#PageContainer").append(tag);
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
							case 9 : key.preventDefault(); break; // tab
							//default : console.log(key.which); break;
						}
				} );
	$(document).keyup(function(key){ switch(key.which)
						{// loops through items in menu - forward for tab, backwards for shift tab.
							case 9 : var i = Menu.indexOf(Get); j = Menu.length-1; 
							if(event.shiftKey) i--; else i++; 
							if(i > j) i = 0; else if(i<0) i = j; // console.log('tab pressed - shift '+ShiftDown); 
							var toGet = Menu[i]; //alert('get '+toGet+ ' i:' +i);
							$('#Menu'+toGet).trigger('click');	
							break; // tabup  
						//	case 16: ShiftDown = false; break; 	
						}
				}); //**END of Keybindings **//

}); //**END of document.ready**//

function jsonToHtml(JSON){ console.log('json:'+ JSON); //console.log(eval(JSON));
	var node = eval(JSON);
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

/*
$(document).ajaxComplete(function() // parse returned data and update relevant info.
  { // alert('Triggered ajaxComplete handler.');
	$(".Expand").click(function(event){
		$('#'+this.name).toggle(); //	alert('clicked a content input button: '+$('#'+this.value)); 
						// event.relatedTarget.currentTarget
 	   });
	
	$(".AddAbove").hover(function(event) {
	 	$('#'+this.name).css({'background-color':$(this).css('background-color')}); 
	  });

	$(".AddAbove").click(function(event){
		//var toAdd = $('#'+this.name).detach();
		//$(this).append($('#'+this.name).detach());
		var SetPosition = $(this).offset();
		SetPosition.left += parseInt($(this).css('width').replace('px','')) 
			+ parseInt($(this).css('padding-right').replace('px',''));
		//alert('width ='+$(this).css('width')+ ' offset ='+$(this).offset().left+' SetPosition.left ='+SetPosition.left);
		$('#'+this.name).css({zIndex:0,position:'fixed',left:SetPosition.left,top:SetPosition.top,
		//'background-color':$(this).css('background-color') 
		});	
		$('#'+this.name).toggle(); //	alert('clicked a content input button: '+$('#'+this.value));
 	   });
	 $('.toghide').click( function(){$('#'+this.value).toggle()} );
  }
 );
*/

function Extras(){
//	$('.Dragable').mousemove(function(event) {console.log('mouse')});

	$('.Dragable').click(function(event){ console.log('clicked dragable'); $('.Dragable').css('cursor','crosshair' ) });
/*	$(".DropTarget").bind("drop",function (event){
			event.preventDefault(); 
			var data=event.dataTransfer.getData("Text");
			event.target.appendChild(document.getElementById(data).cloneNode(true));
			});
	$(".DropTarget").bind("dragover", function (event){event.preventDefault();});*/
};


 	
/*
/* This should be done via JSON instead. */
// new way of doing things, i'm not sure this is the right place to do this. but it'll have to do.			
//			  	 split the data as it is returned, but i'm not sure why this is a good idea...
/*			dataArray = data.split(',', 64);
			  for(var i =0; i < dataArray.length; i++)
				{
				 var temp = dataArray[i].split(':',3); if(temp.length < 3 )
				 {
				  var id = temp[0]; var val = temp[1];

				  alert("id:"+id+" val:"+val);
				  				  $("#"+id).html(val); //alert('adding div '+i);
				 }
				 else {alert('error on data call'); return;}
				} 
			//alert(tab+ 'loaded. with L='+ $("#"+tab).length+" ok?\n"+ data);
*/
