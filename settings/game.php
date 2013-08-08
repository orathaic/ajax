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

	function MenuOutput()
	{
	 foreach($this->Menu as $i => $MenuItem) {echo "<input id='Menu$MenuItem' type='button' value='$MenuItem' name='tab=$MenuItem&parentid=PageContainer' />";} // Button($MenuItem); 
	}

	function GetName()
	{
	 return $this->Name;
	}

	function Head()
	{}
	function Connection()
	{
		switch ($Server)
         {

            default:
                $this->db_user = $this->db_table = 'colony_tmain'; // connects to the database
                break;
         }
         $this->mysqli = new mysqli("localhost", $this->db_user, $this->db_pass, $this->db_table); 
		if (mysqli_connect_errno()) {
    		printf("Connect failed: %s\n", mysqli_connect_error());
    		exit();
			}
//         $mysqli->select_db() or die('Unable to select database!');
		}
function AskForLogin($error=NULL)
{ //$this->Head();

        $ToReturn = 	'
		<div class="content bgbox"><div class=quote>"War is merely the continuation of policy by other means." </div> - Carl von Clausewitz: On War</div> 
		<div id=login class=bgbox><form method="post" action="' . $_SERVER['PHP_SELF'].'">';

        if ($error)
        {
           $ToReturn .= $this->notice($error, 'Problem!', 2);
        }

	$ToReturn .= 	'<b>Login:</b><br /><input type="text" name="_user" size="15">
		<br /><b>Password:</b><br /><input type="password" name="pwd" size="15">
		<br /><input type="submit" value="Log in">';
// THIS NEEDS TO BE IMPLEMENTED!!!
/*		<a href="../user.php?pwd=">Forgotten your password or didn\'t recieve your activation code?</a><br />

		Not <a href="../user.php">Registered</a> yet? <a href="../user.php">Sign-up now!</a></td></tr>
*/
	$ToReturn .= '</form></div>';
	return $ToReturn;
	}

}



class ColonyWars extends Game 
{
	function Head()
	{
	
	if($this->name == '') $title = 'Colony-wars-Ajax'; else $title = $this->name;
	?> 
<!doctype html><html><head>
 <meta charset="utf-8" />
 <title><? echo $title; ?></title>
 <meta name="description" content="<? echo $this->name;?> is an free online role play game." />
 <meta name="keywords" content="free browser based mmorpg, free text based game, internet rpg game" />
 
	<link rel="shortcut icon" href="pix/ajax.ico" />
 	<link rel='stylesheet' type='text/css' href='./styles/default.css' />
	<script type="text/javascript" src="js/jquery-1.10.2.js"></script>
	<script type="text/javascript" src="js/common.js"></script>
	<script type="text/javascript">var Menu = new Array(); <? foreach($this->Menu as $i => $MenuItem){ echo " Menu[$i] ='$MenuItem';";} ?></script>
<?//	<script type="text/javascript" src="js/ajax.js" />
//	<script type="text/javascript" src="js/clay.min.js" />
//	<script type="text/javascript" src="js/clay_func.js" />
// 	<script type="text/javascript" src="js/jq-lint.js"></script>
?>
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
//	 $url = 'http://www.colony-wars.com';

	$this->db_user = 'colony_main';
	$this->db_pass = 'stuff';
	$this->db_table = 'colony_main';
	$this->backgroundimage = "../pix/main_background2.jpg";
	// $bg_image = 'background="../pix/header_star_' . rand(0, 4) . '.jpg"';
	// $lvl5tech = 4;
//	$this->alliance_size = 10;
//	$this->Account = new Player($this); // does all the verification stuff
	$this->Menu = array('SpacePort', 'Jobcentre', 'Explore', 'Junk-bar', 'Technology');
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
	 if(!$mysqli->query($query)) return 'Error saving design - Query: '.$query; else return 1;	
	}


function GetDesignList() {
	 $mysqli = $this->mysqli;
		$query = "SELECT DesignName FROM cw_ship_design WHERE Username = '{$this->Account}'";
		$result = $mysqli->query($query);
		while($tmp = $result->fetch_array()) {$List[] = $tmp['DesignName'];}
		return $List; //array(); array('w','b');
	} 
function GetDesignJSON($DesignName)
	{
	$mysqli = $this->mysqli;
	$query = "SELECT DesignJSON FROM cw_ship_design WHERE Username = '{$this->Account}' AND DesignName = '".$mysqli->real_escape_string($DesignName)."' LIMIT 1";
	$result = $mysqli->query($query);
	$resultobj = $result->fetch_object();
	return $resultobj->DesignJSON;
	}
}

?>
