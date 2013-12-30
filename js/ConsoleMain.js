
	$('a#LogoutLink').on('click',function(event) {	
		Client.Logout('Logout=true');
		event.preventDefault();
	 }
	);

 	$('span#GetOptions').on('click',function() { Client.ChangeTo('SpacePort'); } )

