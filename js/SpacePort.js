var SpacePort = function() {return StateClass('SpacePort');}

SpacePort.prototype.EnterState = function () { 
	$('span#GetOptions').off('click');
	$('input.menuitem').on('click',function() {	/*console.log(this);*/ Client.ChangeTo( $(this).attr('name') );} );
	$('#SpacePort').show(200);
 }

SpacePort.prototype.ExitState = function () {  
	$('input.menuitem').off('click');
	$('span#GetOptions').on('click',function() {Client.ChangeTo('SpacePort'); } )
	$('#SpacePort').hide(200); 
 }
