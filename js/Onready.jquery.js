
 $(document).ready(function ()
{	
	//** default page selection **//
	window.Client = new ClientClass();
	Client.evalJSON( $("#json").text() );
//console.log( $("#json").text() ); 
	if(location.hash == '') { InitialState = 'SpacePort'; } 
	else { InitialState = location.hash.replace('#',''); } 
//console.log('InitialState '+InitialState)
	Client.ChangeTo(InitialState);
 //** END OF default page selection**//

//** This should be done in css **//
 $('#loadtext').position({my:'center',at:'center',of:'#loading'});
//** I can't figure out a good way to do this in CSS **//

	$("#PageContainer").on('click','div.CloseButton',function() {$(this).parent().hide(200)});
/*
	// **Keybindings ** //
	$(document).keydown(function(key){ switch(key.which) 
						{
						//	case 16: ShiftDown = true; break; // shift
						//	case 9 : key.preventDefault(); break; // tab
						//	default : console.log(key.which); break;
						}
				} );
	$(document).keyup(function(key){ 
			// *		var i = Menu.indexOf(Get);
			//			switch(key.which)
						{// loops through items in menu - forward for tab, backwards for shift tab. 
						//NB: passes an extra keycode parameter to the trigger - to specify how the triggered event should handle this - the event passed doesn't contain this
			//				case 37 : j = Menu.length-1; i--; if(i > j) i = 0; else if(i<0) i = j;var toGet = Menu[i]; //alert('get '+toGet+ ' i:' +i);
			//				$('#Menu'+toGet).trigger('click', 1);	
			//				break; // leftup 
			//				case 39 : j = Menu.length-1; i++; if(i > j) i = 0; else if(i<0) i = j;var toGet = Menu[i]; //alert('get '+toGet+ ' i:' +i);
			//				$('#Menu'+toGet).trigger('click', 1);
			//				break; // rightup
			//			//	case 16: ShiftDown = false; break // THIS NEEDS TO BE REWRITTEN with Client
						} * /
				});*/ // **END of Keybindings ** //

}); //**END of document.ready**//

