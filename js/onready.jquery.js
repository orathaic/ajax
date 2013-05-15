 $(document).ready(function(){
//** default page selection **//
var Get = '';
if(location.hash == '') { location.hash = '#Colony'; Get = 'Colony'; }
else { Get = location.hash.replace('#',''); }
$.ajax(
   {
	url: "./content.php?tab=" + Get,
	success:function(data) { $("#PageContainer").append(data); $("#"+Get).show();}
   }
  ); //** END OF default page selection**//

 $('#PageContainer').ajaxComplete(function() // parse returned data and update relevant info.
	{ // alert('Triggered ajaxComplete handler.');
	  $(".Expand").click(function(event){
	$('#'+this.name).toggle();
    //	alert('clicked a content input button: '+$('#'+this.value)); // event.relatedTarget.currentTarget
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
	$('#'+this.name).toggle();
    //	alert('clicked a content input button: '+$('#'+this.value)); // event.relatedTarget.currentTarget
 	 });

	}
 );


//** menu button ajax**//
   $(".toptab input").click(function(event)
	{ var get = this.name; var tab = this.value; 
//		alert('clicked a tab button: '+tab+' #='+$("#"+tab).length); // event.relatedTarget.currentTarget
 	 
      // change tab, hide others, ajax/unhide desired tab, change location #
     if(tab !='') 
      { if(location.hash != '#'+tab) location.hash = '#'+tab}
	//hide content
        $(".content").hide();
		// unhide/ajax get content.value 
   	 if ( $("#"+tab).length != 0)  {$("#"+tab).show();}
	else
	   { 
		$.ajax({url: "./content.php?"+get,
//** TODO setup proper error tab/div - seperate from here - error message is in the content handler cntent.php**//
		statusCode: {404: function() {$("#PageContainer").append(
		"<div class='error content' id='"+tab+"'>Error: Tab not found</div>"
		); }},
		beforeSend: function() {
			$("#loading").show();},
	 	success:function(data) 
		  {	
			//$(".content").hide(); // this is not needed if all content arrives hidden
//			alert( 'data index is: '+data.indexOf('id=login'));
			if(data.indexOf('id=login') == -1)
			{ //alert('splitting data'); 
			$("#loading").hide();
			$("#PageContainer").append(data); // this is deprecated.
			$("#"+tab).show(); // content arrives hidden, then this sets the display */
			}
			else 
			{ $("#PageContainer").html(data); }
		  } 
		 }); 
       } //** end of else**//
	}); //** END OF menu button ajax**//

 

 }); 
/*
/*
// new way of doing things, i'm not sure this is the right place to do this. but it'll have to do.			
//			  	 split the data as it is returned, but i'm not sure why this is a good idea...
			dataArray = data.split(',', 64);
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
