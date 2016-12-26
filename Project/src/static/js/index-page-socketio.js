var socket = io();
var connected = false;

socket.connect();
socket.on('connect', function() {
  if (localStorage.getItem("UniqueID")) {
    console.log(localStorage.getItem("UniqueID"));
    socket.emit("authorize", localStorage.getItem("UniqueID"));
  }
  socket.emit("products", "get_products");
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

socket.on("get_user", function(msg) {
  obj = JSON.parse(msg);

  name = obj.username;
  email = obj.email;
  if ($('#pic-pic').length === 0) {
    $("#profile-picture").append("<img alt='' src='https://s.gravatar.com/avatar/909ecf5782b2ea2ee8888221dd8beba8?s=80' id='pic-pic'/>");
  }
  if ($('#name-name').length === 0) {
    $("#profile-name").append("<span class='card-title' id='name-name'>" + name + "</span>");
  }
});

socket.on("products", function(msg) {
  obj = JSON.parse(msg);
  $("#product").remove();
  obj.forEach(function(item){
    var stars = item.note;
    var star_code = "";
    i = 0;
    while (i++ < stars) {
      star_code = star_code + "<span class='glyphicon glyphicon-star'></span>";
    }
    $("#product-list").append("<div class='col-sm-4 col-lg-4 col-md-4' id='product'><div class='thumbnail'><img src='" + item.picture + "' alt=''><div class='caption'><h4 class='pull-right'>" + item.price + "$" + "</h4><h4><a href='#'>" + item.name + "</a></h4><p>" + item.description + "</p></div><div class='ratings'><p>" + star_code + "</p></div></div></div>");
  });
  console.log("All products added !");
});

socket.on('authorize', function(msg) {
  console.log(msg);
  if (msg === "OK") {
    connected = true;
    $("#navbar-ul").append("<li><a href='#profile' id='profile-button'>Profile</a></li>");
    $("#navbar-ul").append("<li><a href='#signout' id='nav-logout-button'>Log out</a></li>")
    $("#nav-login-button").remove();
    $("#navbar-ul").append("<li><button type='button' class='toggle-button btn btn-primary btn-lg nav-btn-perso' data-toggle='button' aria-pressed='false' autocomplete='off' id='nav-cart'>☰ Chart</button></li>");
    $("#my-slide-panel").append("<nav id='navbar-main' style='margin-top : 51px;''></nav>");
    document.getElementById("nav-logout-button").onclick = function fun() { signout(); }
    document.getElementById("profile-button").onclick = function fun() { show_profile(); }
    loadScript("/static/js/slideout-1.0.1/dist/slideout.js", slide);
  }
  else {
    connected = false;
    if ($('#nav-login-button').length === 0) {
      $("#navbar-ul").append("<li><a href='#signup' data-toggle='modal' data-target='.bs-modal-sm' id='nav-login-button'>Log in</a></li>")
    }
    $("#nav-logout-button").remove();
    $("#nav-cart").remove();
    $("#navbar-main").remove();
    $("#profile-button").remove();
    document.getElementById("main").style.display = 'block';
    document.getElementById("profile-view").style.display = 'none';
  }
});

window.onload = function() {
	var script = document.createElement('script');
	script.src = 'http://code.jquery.com/jquery-1.11.0.min.js';
	script.type = 'text/javascript';
	document.getElementsByTagName('head')[0].appendChild(script);
  document.getElementById("signinButton").onclick = function fun() { signin(); }
  document.getElementById("signupButton").onclick = function fun() { signup(); }
  document.getElementById("main-view").onclick = function fun() { show_main(); }
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
  socket.emit("signout", "signout");
}

function show_profile() {
  socket.emit("get_profile", localStorage.getItem("UniqueID"));
  document.getElementById("main").style.display = 'none';
  document.getElementById("profile-view").style.display = 'block';
}

function show_main() {
  document.getElementById("main").style.display = 'block';
  document.getElementById("profile-view").style.display = 'none';
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
