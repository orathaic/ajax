<?php

class Game
{
	private $Name = 'default game name';
	
	function __construct() {
	 $this->db_user = '';
	 $this->db_pass = '';
	 $this->db_table = '';
	 $this->Server = 'Main';
	 $this->Menu = array('Menu');

	 $this->note = ''; // used for error messages
	}

	public
	function notice($notice, $header = false, $style = 1)
	{

        $ToReturn .= '<table class="notice' . $style . '" width="600">';

        if (isset($header))
        {
            $ToReturn .= '<tr class="title"><td>' . $header . '</td></tr>';
        }
        $ToReturn .= '<tr class="notice"><td>' . $notice . '</td></tr></table><br /><br />';
	return $ToReturn;
    }

	function GetName()
	{
	 return $this->Name;
	}

	function Head()
	{}
	function Connection()
	{
        //    default:
		
        //        $this->db_user = $this->db_table = 'colony_main'; // connects to the database

         $this->mysqli = new mysqli("localhost", $this->db_user, $this->db_pass, $this->db_table); 
		if (mysqli_connect_errno()) {
    		printf("Connect failed: %s\n", mysqli_connect_error());
    		exit();
			}
//         $mysqli->select_db() or die('Unable to select database!');
		}
	function AskForLogin($error=NULL)
	{	
		if($error) { $Error = new htmlphp('span','content','ErrReply'); $Error->addtext("$error"); $Error = ','.$Error; }
		else $Error = '';

		if($_POST['tab'] != 'Login')
		{
			if(!isset($_POST['tab']) && !isset($_POST['Logout'])) {$ShowLogin = new calljs('ChangeHash',array('Login'));}
			else {$ShowLogin = new calljs('ChangeTo',array('Login'));} 

			if($_POST['ajax']) {$PreventCallback = new calljs('PreventCallback', array('')); return $ToReturn = "[$ShowLogin,$PreventCallback$Error]";}
			else return $ToReturn = "[$ShowLogin$Error]"; 
		} 	// nb Error has a leading , 
		else
		{

// THIS NEEDS TO BE IMPLEMENTED!!!
/*		<a href="../user.php?pwd=">Forgotten your password or didn\'t recieve your activation code?</a><br />

		Not <a href="../user.php">Registered</a> yet? <a href="../user.php">Sign-up now!</a></td></tr>
*/
			$QuoteNode = new htmlphp('div','content','PageContainer'); $QuoteNode->addattr('class','content bgbox loginpg')->addchild('div')->addattr('class','quote')->addtext('"War is merely the continuation of policy by other means."');
			$QuoteNode->addtext(' - Carl von Clausewitz: On War');

			$LoginForm = new htmlphp('form','content','Console');
			$LoginForm->addattr('class','loginpg hidden')->addattr('method','post')->addattr('onSubmit','return false;')->addattr('id','Login');
			$LoginForm->addchild('span')->addattr('class','bold')->addtext('Login:');
			$LoginForm->linebreak()->addchild('input')->addattr('type','text')->addattr('name','_user')->addattr('size','15');
			$LoginForm->linebreak()->addchild('span')->addattr('class','bold')->addtext('Password:');
			$LoginForm->linebreak()->addchild('input')->addattr('type','password')->addattr('name','pwd')->addattr('size','15');
			$LoginForm->linebreak()->addchild('input')->addattr('type','submit')->addattr('value','Log in')->addattr('id','LoginButton');
			$ErrorNode = new htmlphp('span','content','Console');
			$ErrorNode->addattr('class','error')->addattr('id','ErrReply');

			$DevNode = new htmlphp('div','content','PageContainer');
			$ListNode =	&$DevNode->addattr('id','DevNode')->addattr('class','loginpg content bgbox')->addtext('Current Task List:')->linebreak()->linebreak()->addchild('ul');
			$SubList = &$ListNode->addchild('li')->addtext('Client-server interaction(s)')->addchild('ul');
			$SubList->addchild('li')->addattr('style','text-decoration: line-through')->addtext('login verification');
			$SubList->addchild('li')->addattr('style','text-decoration: line-through')->addtext('logout&state?');
			$ListNode->addchild('li')->addtext('Client Testing.')->addchild('ul')->addchild('li')->addtext('Debug event triggers twice (onload designs).');
			$ListNode->addchild('li')->addtext('New Tab transition-animations');
			$ListNode->addchild('li')->addtext('Tech-Design descriptions (db-change)');
			$ListNode->addchild('li')->addtext('fix JSON responce for login timeouts');

			$jsString = file_get_contents('./js/LoginForm.js');
			if($jsString)
			{
				$Script = new htmlphp('script','attachjs');
				$Script->addattr('js', $jsString);
			} else $Script = '{}';
	
			return $ToReturn = "[$QuoteNode,$LoginForm,$DevNode,$ErrorNode,$Script$Error]";
		} // END OF ELSE
	 } // END OF askforlogin
} // END OF CLASS Game


// ** This game is not colonywars... ** //
class ColonyWars extends Game 
{
	function SendReturn($Content) 
	{
		if(isset($_POST['ajax']) && $_POST['ajax'] == 'true')
		return $Content;
		else 
		return $this->GetPage($Content);
	}

	function GetContent($Tab) {
	require_once "./content/content.php";
	include_once "./content/".$Tab.".php";

		if(class_exists($Tab))
		$ToReturn = new $Tab($this);  
		else {
		$ToReturn = new content($Tab,$this); 
		}
	return $ToReturn;
	}	

	function GetPage($Content)
	{
	 $ToReturn = $this->Head();
	$ToReturn .= "
	<div id=PageContainer>
		<div id=Console class=\"bgbox\">
		</div>	
	</div>
	<div id=loading class='hidden'><div id=loadtext class='bgbox'><img src=./pix/loading_.gif height=20 width=20 alt=loading /></div> </div>
	<div class=hidden id=json>$Content</div>
	</body></html>";
	return $ToReturn;
	}

	function Head()
	{
	
	if($this->name == '') $title = 'Colony-wars-Ajax'; else $title = $this->name;
	?> 
	<!doctype html><html><head>
	 <meta charset="utf-8" />
	 <title><? echo $title; ?></title>
	 <meta name="description" content="<? echo $this->name;?> is an free online role play game." />
	 <meta name="keywords" content="browser based mmo" />
		<link rel="shortcut icon" href="pix/ajax.ico" />
	 	<link rel='stylesheet' type='text/css' href='./styles/default.css' />
		<script type="text/javascript" src="js/jquery-1.10.2.js"></script>
		<script type="text/javascript" src="js/jquery-ui-1.10.3.custom.min.js"></script>
<!--		<script type="text/javascript" src="js/jquery.mousewheel.min.js"></script> -->

		<script type="text/javascript" src="js/Client.js"></script>
<!--		<script type="text/javascript" src="js/common.js"></script> -->
		<script type="text/javascript" src="js/Onready.jquery.js"></script>
	</head>
		<?php
	}
	// var $name, $url, $db_user, $db_pass, $db_table;
	//	var $alliance_size, $logins, $lvl5tech;
	function GetUser()
	{
		$this->Account = new Player($this);
	}


	function __construct() {
		$this->name = 'Colony-Wars';	
	//	$url = 'http://www.colony-wars.com';

		$this->db_user = 'colony_ajax';
		$this->db_pass = 'stuff123';
		$this->db_table = 'colony_ajax';
		$this->backgroundimage = "../pix/main_background2.jpg";
	//	$this->Menu = array('SpacePort', 'Jobcentre', 'Explore', 'Junk-bar', 'Technology');
		$this->Connection();
		$this->GetUser();
	   }

	function SaveShipDesign($JSON,$DesignName) 
		{
		 $mysqli = $this->mysqli;
		 $query = "SELECT * FROM cw_ship_design WHERE Username = '".$this->Account."' AND DesignName = '".$mysqli->real_escape_string($DesignName)."' ";
		 if($mysqli->query($query)->num_rows  > 0)
					{
					 $query = "UPDATE cw_ship_design SET DesignJSON ='".$mysqli->real_escape_string($JSON)."'
					 WHERE Username = '".$this->Account."' AND DesignName = '".$mysqli->real_escape_string($DesignName)."'";
					} 
		else		{
					 $query = "INSERT INTO cw_ship_design (Username, DesignName, DesignJSON)
					 VALUES ('".$this->Account."','".$mysqli->real_escape_string($DesignName)."','".$mysqli->real_escape_string($JSON)."')"; 
					} 
		 if(!$mysqli->query($query)) return 'Error saving design - Query: '.$query; else return 1;	 // 1 is understood on the client as success.
		}

	function GetDesignList() {
		 $mysqli = $this->mysqli;
			$query = "SELECT DesignName FROM cw_ship_design WHERE Username = '{$this->Account}'";
			if($result = $mysqli->query($query))
			{while($tmp = $result->fetch_array()) {$List[] = $tmp['DesignName'];}
			return $List; } //array(); array('w','b');
			else return 'Error4';
		} 

	function GetDesignJSON($DesignName)
		{
		$mysqli = $this->mysqli;
		$query = "SELECT DesignJSON FROM cw_ship_design WHERE Username = '{$this->Account}' AND DesignName = '".$mysqli->real_escape_string($DesignName)."' LIMIT 1";
		$result = $mysqli->query($query);
		$resultobj = $result->fetch_object();
		return $resultobj->DesignJSON;
		}

	function GetDesignDesc($DesignName)
		{
		$mysqli = $this->mysqli;
		$query = "SELECT DesignDesc FROM cw_ship_design WHERE Username = '{$this->Account}' AND DesignName = '".$mysqli->real_escape_string($DesignName)."' LIMIT 1";
		$result = $mysqli->query($query);
		$resultobj = $result->fetch_object();
		return $resultobj->DesignDesc;
		}

}

?>
