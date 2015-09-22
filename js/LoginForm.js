$('input#LoginButton').on('click',function() {	
	Client.Login( $(this.parentNode).serialize() );
	$('#ErrReply').text('');
	}
);

var Login = function() {return StateClass('Login');}

Login.prototype.EnterState = function () 
	{
		$('#MenuNode').hide(200);
		$('#Login')[0].reset();
		$('.loginpg').show(200);
		$('#Console').addClass('Console-large').removeClass('Console-small');
		//console.log('Login->EnterState');
	}

Login.prototype.ExitState = function () 
	{
		$('.loginpg').hide(200); $('#ErrReply').text(''); 
		$('#MenuNode').show(200);
		$('#Console').removeClass('Console-large').addClass('Console-small');
		//console.log('Login->ExitState');
	}

Login.prototype.Refresh = function ()
	{
	 $('#ErrReply').text('');
	 $('#Login')[0].reset();
	}
