//console.log(' ConsoleMain.js - this will probably be removed...');

	$('a#LogoutLink').on('click',function(event) {	
		Client.Logout('Logout=true');
		event.preventDefault();
	 }
	);

 	$('span#GetOptions').on('click',function() { Client.ChangeTo('SpacePort'); } )

