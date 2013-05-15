<?
class Player
{
private $user, $Game;

	function __construct($Game, $SetUser = '') 
	{
	$this->Game = $Game; 

	if($_GET['Logout'] == 'true')
	 { unset($_SESSION['user']); }
	else if(isset($_POST['user']))
	 { 
	  $note = $this->VerifyUser($_POST['user'], $_POST['pwd']);
	  if($note == 1)
	   { $_SESSION['user'] = $_POST['user'];}
	 } 
	 if(isset($_SESSION['user']))
	 { 
	  $this->user = $_SESSION['user'];
	 }
	 else { $this->user = '';}
	}
public 
function getusername() {return ucwords(str_replace('_',' ',$this->user));}
function VerifyUser($user, $pwd)
	{
	 $this->Game->connection();
	   $user = mysql_real_escape_string($user);
	   $pwd = mysql_real_escape_string($pwd);// filter out SQL injection
	 // verfiy against database
	 $query = "SELECT status FROM cw_accounts WHERE username = '$user' AND passcode = md5('$pwd')";
	 $getMyDetails = mysql_query($query) or die(mysql_error());

   // -= FAILURE : Username or Pass wrong, or no account.
	if (mysql_num_rows($getMyDetails) == 0)
	{ $query = "INSERT INTO cw_failedlogins VALUES(NULL, '" . $_SERVER['REMOTE_ADDR'] ."', '" . $user . "', md5('" . $password . "'))"; 
	mysql_query($query) or die(mysql_error()); 
	return $note = 'Your username (' . $user .') or password are incorrect, or you do not have a Colony-Wars account.';
	}
   // -= FAILURE : Unactivated account. Forward to activation=-
    $memberstatus = mysql_result($getMyDetails, 0);
    if ($memberstatus == 'unactivated')
    {
       //header("Location: ../user.php?ac=$user"); //redirect to acount activation??
       return $note = 'ERROR: Your account is not activated.';
    }
    // User banned?
	$amIBanned = mysql_query("SELECT * FROM cw_bans WHERE username = '{$user}' OR ip = '{$_SERVER['REMOTE_ADDR']}' AND confirmer <> '' LIMIT 1") or die(mysql_error());
	if(mysql_num_rows($amIBanned) > 0)
	 {
        $info = mysql_fetch_assoc($amIBanned);
        if ($info['note'] == '')
        { $info['note'] = 'No reason supplied'; }

	    return $note = 'Your username or ip address has been banned for the following reason: ' .
            $info['note'] . '.<br><br>You can discuss or appeal against this ban in the forums.';
	    }
	// if verified continue

	  return true;
	}
} // end of class player

?>
