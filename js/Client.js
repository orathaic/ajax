//"use strict";

var StateClass = function(init) { /*console.log(this);*/ this.Name = init; } 

StateClass.prototype.EnterState = function() { //console.log('State->EnterState: '+this.Name)
	var Tab;
	if((Tab = $('#'+this.Name)).length == 1)
	  {Tab.show(200);}
	else {
	console.log('tab not found '+Tab+ ' ' + '#'+this.Name/* ajax call for get Tab id*/);
 	// show tab/content related to this state, ajax/unhide desired tab, change location,  
	}
}

StateClass.prototype.ExitState= function() { $('#'+this.Name).hide(200); }//console.log('State->ExitState: '+this.Name)

StateClass.prototype.Refresh = function() {  console.log('TO IMPLEMENT State->RefreshState: '+this.Name) }


var ClientClass = function()
{
	this.State = new StateClass('loading'); // Finite State Machine stuff here.
	this.PrevState = {};
	this.Player = {Name:'TEMP'}//new Player();
}

ClientClass.prototype.Login = function(Args) 
{
	console.log('HTTPS please, everywhere.');
	var RespFunc = function() {return Client.ChangeTo('SpacePort')} // this should not be using the 'Client' variable, if possible
	this.ajaxCall(Args,RespFunc); // this should change to default page if spaceport was not chosen...
	
}

ClientClass.prototype.SetUsername = function(Name)
{ if(Name !== this.Player.Name) this.Player.Name = Name; }


ClientClass.prototype.Logout = function()
{
	var RespFunc = function() {return function() {this.ChangeTo('Login')} }
	this.ajaxCall('Logout=true',RespFunc);
	this.Player.Name = '';
}

ClientClass.prototype.ChangeTo = function(NewState, ExtraArgs)
{ //console.log(this);
	//console.log('Client->ChangeTo '+NewState+ ' <- From: ' + this.State.Name + ' '); 
 
	function FunctionBinder(Client) { return function() { FindAndRunEnterState(Client)}; }
	function FindAndRunEnterState(Client)
	{ 	
//		console.log('in find and run: '+NewState);
		Client.State.ExitState(); 
		Client.PrevState = this.State;

		if(typeof(window[NewState]) === 'function') 
		{Client.State = new window[NewState]();} 
		else {Client.State = new StateClass(NewState);}
		Client.State.EnterState();
		Client.State.Name = NewState; // this masks a bug!
		location.hash = '#'+Client.State.Name;
	}

	if(NewState != this.State.Name)
	{
		if(( $('#'+NewState)).length == 1)
		{	//console.log(NewState + ' newstate found')
			FindAndRunEnterState(this); 
		}
		else
		{	//console.log(NewState+' newstate not found');
			var SendArgs = 'tab='+NewState
			if(ExtraArgs != undefined) { SendArgs += '&'+ExtraArgs;} 
			this.ajaxCall(SendArgs, FunctionBinder(this, FindAndRunEnterState));
		}
	}
	else 
	{	//console.log('State not changed');
		this.State.Refresh();		
	}
}
ClientClass.prototype.ErrorOutput = function (output) {alert(output);} // should be in window error message

ClientClass.prototype.evalJSON = function(data){ //console.log('eval:' + typeof(data)+ 'data: '+data+' '); 
	try{var node = JSON.parse(data); } catch(err) {console.log(err+ '; data: '+data); } //*Note, JSON data should include a node array.* /
	try{	
		for(var i = 0, l=node.length ; i < l; i++)
			{
			 this.HandleNode(node[i], i);
			}
		return true;
		}
	catch(err) {console.log(err);}
}

ClientClass.prototype.ajaxCall = function (data, ResponceFunc){
//	var Client = this; // using global Client defn.
	$.ajax({url: "./index.php",
	type:'POST',
	data:'ajax=true&'+data,
	statusCode: {
		404: function() {$("#PageContainer").append("<div class='error content' id='"+tab+"'>Error: Tab "+tab+" not found</div>")}
	},
	beforeSend: function() { $("#loading").show(); //console.log('Before Send: '+data+ ' this.state.name is : '+this.State.Name ); //console.log(Client)
	},
 	success:function(data) 
	  {	//console.log('After Send: resp func='+ResponceFunc);
		Client.evalJSON(data);
		$("#loading").hide();
		//$("#"+tab).show(200); // content arrives hidden, then this sets the display 
		if(	!this.BoolPreventCallback && typeof(ResponceFunc) === 'function') {/*console.log('.ajax->ResponceFunc '+ResponceFunc);*/ ResponceFunc(); }
		else { this.BoolPreventCallback = false;}
	  },
	});
}

ClientClass.prototype.PreventCallback = function() { //console.log('Client->PreventCallback');
	this.BoolPreventCallback = true;
}

ClientClass.prototype.HandleNode = function (node, i){
//	console.log(node);
		 switch(node.cmd)
		 {			
			case 'content': 
			var tag = this.jsonToHtml(node), loc = $("#"+node.loc); // node.loc determines where on the page content is added
			if(tag && loc) loc.append(tag); 
				else console.log('Error: node ['+i+'] did not resolve to html :'+loc+'-'+tag);
				break;
			case 'ReplaceContent':
			var tag = this.jsonToHtml(node), loc = $("#"+node.loc), remove = $("#"+tag.id);
			
			if(remove.length != 0) {remove.replaceWith( tag ); }
			else
				if(tag && loc) loc.append(tag); 
					else console.log('Error: node ['+i+'] did not resolve to html :'+loc+'-'+tag);
				break;
			case 'attachjs': 
			try{		if(node.attr.js) { this.jsonToScriptInHead(node.attr.js);/*eval(node.attr.js);*/ }  } catch(err) {console.log(err+ ' '+node.attr.js)}
				break;
			case 'calljs': if(typeof(this[node.func]) == "function") { this[node.func](node.args[0]); } else { console.log('Error: node ['+i+'] - func not found: '+node.func); console.log(typeof(node.func)); }
				
				break; // May need to use more than just the first arg. ** there is special stuff for handling this in JS ** (maybe)
			default: console.log('Error: node ['+i+'] - cmd: '+node.cmd); console.log(node); break;
		 }
		 //var tag = this.jsonToHtml(node[i]); if(tag) $("#"+node[i].loc).append(tag);
}

ClientClass.prototype.jsonToHtml = function (node){
	//Should I be using a documentfragment? would be nice, even for recursive?
	var tag = document.createElement(node.tn);
	if(node.children) {
	for(var i = 0; i < node.children.length; i++) {
	if(node.children[i].tn == 'text') tag.appendChild(document.createTextNode(node.children[i].text));
	else tag.appendChild(this.jsonToHtml(node.children[i]));
	 }
	} 
	if(node.attr) {
	 for(var key in node.attr) {
	  tag.setAttribute(key, node.attr[key]);
	 }	 
	}
 return tag;
}

ClientClass.prototype.jsonToScriptInHead = function (script){
	var tag = document.createElement('script');
	tag.setAttribute('type','text/javascript');
	tag.innerHTML=script;
	document.head.appendChild(tag);
}

ClientClass.prototype.ChangeHash = function (tag) {
	location.hash = tag;
}
