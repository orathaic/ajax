<?php
session_start();
$MyPath = "../";
require_once './settings/game.info.php';
//require_once 'OldFunctions.php';
//require_once '../settings.php';

$Game = new Colonywars(); 
// asks for login if session is not setup

//echo $DirandPage = explode( '/', $_ENV["REQUEST_URI"]);
//$_Page = $DirandPage[3];
/*<?php  $DirandPage = explode( '/', $_ENV["REQUEST_URI"]); for ($i = 0; $i < count($DirandPage); $i++) 
{echo $DirandPage[$i]." <br />";}*/

$Game->Head(); // outputs page head 

$Game->connection();
$Game->GetUser();

?>
<body>



<br />
<div id=PageContainer>
<?	
if($Game->Account->getusername() == '')
 {echo $Game->AskForLogin(); echo '</div>'; exit();}
else {
?>
<div id=logout class=bgbox> Hi <? echo $Game->Account->getusername();?>, <a href=?Logout=true>Logout</a>?</div><br />
<!-- <div id='canvas'> </div>
-->

<div class='toptab'><? $Game->MenuOutput(); ?> 	

	</div>
<img class=hidden id=loading src=./pix/loading_big_.gif height=20 width=20>
</div>
<?php }
echo '<script type="text/javascript" src="js/onready.jquery.js"></script>'; // this is needed for 'normal' functionality.
 ?>
</body>
