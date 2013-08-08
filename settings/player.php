<?

class Player
{
private $User, $Game;

	function __construct($Game, $SetUser = '') 
	{
	$this->Game = $Game; 
	if(isset($_GET['Logout'])) {
		if($_GET['Logout'] == 'true')
	 { unset($_SESSION['user']); }  
	}
	else if(isset($_POST['_user']))
	 {
	  $note = $this->VerifyUser($_POST['_user'], $_POST['pwd']);
	  if($note == 1)
	   { $_SESSION['user'] = $_POST['_user'];}
		// else output error note
	 } 
	 if(isset($_SESSION['user']))
	 { 
	  $this->User = $_SESSION['user'];
	 }
	 else { $this->User = '';}
	}
public 
function GetUsername() {return ucwords(str_replace('_',' ',$this->User));}
function __toString() {return $this->User;}

function VerifyUser($user, $pwd)
	{ //echo 'in verify';
	 $mysqli = $this->Game->mysqli;
	   $user = $mysqli->real_escape_string($user);
	   $pwd = $mysqli->real_escape_string($pwd);// filter out SQL injection
	 // verfiy against database
	 $query = "SELECT status FROM cw_accounts WHERE username = '$user' AND passcode = md5('$pwd')";
	 $getMyDetails = $mysqli->query($query) or die($mysqli->error());

   // -= FAILURE : Username or Pass wrong, or no account. /*This needs to be fixed, currently errors out*/
	if ($getMyDetails->num_rows == 0)
	{ $query = "INSERT INTO cw_failedlogins VALUES(NULL, '" . $_SERVER['REMOTE_ADDR'] ."', '" . $user . "', md5('" . $password . "'))"; 
	$mysqli->query($query) or die($mysqli->error); 
	return $note = 'Your username (' . $user .') or password are incorrect, or you do not have a Colony-Wars account.';
	}
   // -= FAILURE : Unactivated account. Forward to activation=-
    $memberstatus = $getMyDetails->fetch_field->status;
    if ($memberstatus == 'unactivated')
    {
       //header("Location: ../user.php?ac=$user"); //redirect to acount activation??
       return $note = 'ERROR: Your account is not activated.';
    }
    // User banned?
	$amIBanned = $mysqli->query("SELECT * FROM cw_bans WHERE username = '{$user}' OR ip = '{$_SERVER['REMOTE_ADDR']}' AND confirmer <> '' LIMIT 1") or die($mysqli->error());
	if($amIBanned->num_rows > 0)
	 {
        $info = mysqli_fetch_assoc($amIBanned);
        if ($info['note'] == '')
        { $info['note'] = 'No reason supplied'; }

	    return $note = 'Your username or ip address has been banned for the following reason: ' .
            $info['note'] . '.<br /><br />You can discuss or appeal against this ban in the forums.';
	    }
	// if verified continue

	  return true;
	}
} // end of class player

?>
