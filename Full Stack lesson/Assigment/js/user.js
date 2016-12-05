"use strict";

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

	var retObj = { return_code : "0", username : userName, pass : password };
	var obj = JSON.stringify(retObj);

	$.ajax(
		{
		    url : 'http://localhost:3000/signin',
		    type : 'GET',
		    data : 'username=' + userName + '&pass=' + password,

		success : function(code_html, statut){
			console.log("INFO :\trequête de connexion bien envoyée");
       	},
       	error : function(resultat, statut, erreur){
			console.log("INFO :\terreur lors de la requête de connexion : " + erreur);
       	},
       	complete : function(resultat, statut){}
	});
}