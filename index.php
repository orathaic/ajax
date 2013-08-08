<?php
session_start();

require_once './settings/game.info.php';

$Game = new Colonywars(); 
// asks for login if session is not setup

//echo $DirandPage = explode( '/', $_ENV["REQUEST_URI"]);
//$_Page = $DirandPage[3];
/*<?php  $DirandPage = explode( '/', $_ENV["REQUEST_URI"]); for ($i = 0; $i < count($DirandPage); $i++) 
{echo $DirandPage[$i]." <br />";}*/

$Game->Head(); // outputs page head 
//echo $Game->Account->GetUsername(); exit();
?>
<body>

<br />
<div id=PageContainer>
<? 
if($Game->Account->GetUsername() == '')
 {echo $Game->AskForLogin(); echo '</div>'; exit();}
else {
?>
<div id=logout class=bgbox> Hi <span id=GetOptions><? echo $Game->Account->getusername();?></span>, <a href=?Logout=true>Logout</a>?</div><br />
<!-- <div id='canvas'> </div>
-->

<div id='TopTab'><? $Game->MenuOutput(); ?> 	

	</div>
<img class=hidden id=loading src=./pix/loading_.gif height=20 width=20 alt=loading />
</div>
<?php }
echo '<script type="text/javascript" src="js/onready.jquery.js"></script>'; // this is needed for 'normal' functionality.
 ?>
</body>
