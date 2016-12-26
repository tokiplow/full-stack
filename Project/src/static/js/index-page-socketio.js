var socket = io();
var connected = false;

socket.connect();
socket.on('connect', function() {
  if (localStorage.getItem("UniqueID")) {
    console.log(localStorage.getItem("UniqueID"));
    socket.emit("authorize", localStorage.getItem("UniqueID"));
  }
});

var slide = function slide() {
  var slideout = new Slideout({
      'panel': document.getElementById('main'),
      'menu': document.getElementById('navbar-main'),
      'padding': 256,
      'tolerance': 70,
      'side': 'right'
  });

  // Toggle button
  document.querySelector('.toggle-button').addEventListener('click', function() {
      slideout.toggle();
  });

  function close(eve) {
      eve.preventDefault();
      slideout.close();
  }

  slideout
      .on('beforeopen', function() {
          this.panel.classList.add('main-open');
      })
      .on('open', function() {
          this.panel.addEventListener('click', close);
      })
      .on('beforeclose', function() {
          this.panel.classList.remove('main-open');
          this.panel.removeEventListener('click', close);
      });
}

socket.on("errors", function(msg) {
  if (msg === 'signup') {
    alert("This login is already taken !");
  }
  else if (msg === 'signin') {
    alert("Wrong IDs");
  }
});

socket.on('authorize', function(msg) {
  console.log(msg);
  if (msg === "OK") {
    connected = true;
    $("#navbar-ul").append("<li><a href='#signout' id='nav-logout-button'>Log out</a></li>")
    $("#nav-login-button").remove();
    $("#navbar-ul").append("<li><button type='button' class='toggle-button btn btn-primary btn-lg nav-btn-perso' data-toggle='button' aria-pressed='false' autocomplete='off' id='nav-cart'>☰ Chart</button></li>");
    $("#my-slide-panel").append("<nav id='navbar-main' style='margin-top : 51px;''></nav>");
    document.getElementById("nav-logout-button").onclick = function fun() { signout(); }
    loadScript("/static/js/slideout-1.0.1/dist/slideout.js", slide);
  }
  else {
    connected = false;
    if ($('#nav-login-button').length === 0) {
      $("#navbar-ul").append("")
    }
    $("#nav-logout-button").remove();
    $("#nav-cart").remove();
    $("#navbar-main").remove();
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
  if (userName.length === 0) {alert("Login cannot be empty !"); return;}
	var password = document.getElementById('passwordSignup').value;
  if (password.length < 4) {alert("Password must be at least 4 characters long"); return;}
	var Email = document.getElementById('emailSignup').value;
  var Mobile = document.getElementById('mobileSignup').value;
	var Obj = { return_code : "0", username : userName, pass : password , email : Email, mobile : Mobile};
	var data = JSON.stringify(Obj);
  socket.emit("signup", data);
}

function signout() {
	//var Obj = { return_code : "0", username : userName, pass : password , email : Email, mobile : Mobile};
	//var data = JSON.stringify(Obj);
  socket.emit("signout", "signout");
}

function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}

function reloadStylesheets() {
    var queryString = '?reload=' + new Date().getTime();
    $('link[rel="stylesheet"]').each(function () {
        this.href = this.href.replace(/\?.*|$/, queryString);
    });
}
