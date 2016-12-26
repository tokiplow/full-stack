var socket = io();
var connected = false;

socket.connect();
socket.on('connect', function() {
  if (localStorage.getItem("UniqueID")) {
    console.log(localStorage.getItem("UniqueID"));
    socket.emit("authorize", localStorage.getItem("UniqueID"));
  }
});

socket.on('authorize', function(msg) {
  console.log(msg);
  if (msg === "OK") {
    connected = true;
    $("#navbar-ul").append("<li><a href='#signout' id='nav-logout-button'>Log out</a></li>")
    $("#nav-login-button").remove();
  }
  else {
    connected = false;
    $("#navbar-ul").append("<li><a href='#signup' data-toggle='modal' data-target='.bs-modal-sm' id='nav-login-button'>Log in</a></li>")
    $("#nav-logout-button").remove();
  }
});

window.onload = function() {
	var script = document.createElement('script');
	script.src = 'http://code.jquery.com/jquery-1.11.0.min.js';
	script.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(script);
  document.getElementById("signinButton").onclick = function fun() { signin(); }
  document.getElementById("signupButton").onclick = function fun() { signup(); }
}

function signin() {
	var userName = document.getElementById('userNameLogin').value;
	var password = document.getElementById('passwordLogin').value;

  if (!localStorage.getItem("UniqueID")) {
    var randomlyGeneratedUID = Math.random().toString(36).substring(3,16) + +new Date;
    localStorage.setItem('UniqueID', randomlyGeneratedUID);
  }
	var Obj = { return_code : "0", username : userName, pass : password, uid : localStorage.getItem("UniqueID")};
	var data = JSON.stringify(Obj);
  socket.emit("signin", data);
}

function signup() {
	var userName = document.getElementById('userNameSignup').value;
	var password = document.getElementById('passwordSignup').value;
	var Email = document.getElementById('emailSignup').value;
  var Mobile = document.getElementById('mobileSignup').value;
	var Obj = { return_code : "0", username : userName, pass : password , email : Email, mobile : Mobile};
	var data = JSON.stringify(Obj);
  socket.emit("signup", data);
}
