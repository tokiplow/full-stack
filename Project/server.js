var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require("fs");
var item_list = require("./items.json");

var connected_user = [];

app.use('/static', express.static(__dirname + '/src/static/'));
//app.use('/modules', express.static(__dirname + '/node_modules/'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + "/src/template/index_hl.html");
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function() {
    console.log('user disconnected');
    var index = -1;
    var i = 0;
    connected_user.forEach(function(item){
      if (item.socketID === socket.id) {index = i;}
      i = i + 1;
    });
    if (index === -1) {
      console.log("Whatever...")
      return;
    }
    connected_user[index]['active'] = false;
    uid = connected_user[index].uid;
    setTimeout(function () {
      if (!connected_user[index] || connected_user[index].uid != uid) {
        console.log("user already logged out...")
        return;
      }
      if (!connected_user[index].active) {
        console.log(connected_user[index].username + " has been force logged out");
        connected_user.splice(index, 1);
        index = -1;
      }
      if (index != -1) {
        console.log(connected_user[index].username + " reconnected before auto logout");
      }
    }, 10000);
  });

  socket.on('signup', function(msg) {
    console.log('signup data: ' + msg);
    data = JSON.parse(msg);
    var user = {username : data.username, pass : data.pass , email : data.email, mobile : data.mobile};
    var userList = require("./users.json");
    userList.push(user);
    data = JSON.stringify(userList);
    fs.writeFileSync("./users.json", data);
    //var jsonFile = fopen('./user.json','w+');
    //fwrite(jsonFile, data);
    //fclose(jsonFile);
    console.log(userList.length);
  });

  socket.on('signin', function(msg) {
    console.log('signin data: ' + msg);
    data = JSON.parse(msg);
    var user = {username : data.username, pass : data.pass, uid : data.uid, socketID : socket.id, active : false};
    var exist = false;
    var userList = require("./users.json");
    userList.forEach(function(item){
      if (item.username === user.username && item.pass === user.pass) {exist = true;}
    });
    if (exist) {
      user['active'] = true;
      connected_user.push(user);
      socket.emit("authorize", "OK");
      return;
    }
    socket.emit("authorize", "KO")
  });

  socket.on('authorize', function(uid){
    var exist = false;
    connected_user.forEach(function(item){
      if (item.uid === uid) {
        exist = true;
        item['socketID'] = socket.id;
        item['active'] = true;
      }
    });
    if (exist) {
      socket.emit("authorize", "OK");
      return;
    }
    socket.emit("authorize", "KO");
  });

  socket.on('signout', function(msg) {
    var index = -1;
    var i = 0;
    connected_user.forEach(function(item){
      if (item.socketID === socket.id) {index = i;}
      i = i + 1;
    });
    if (index === -1) {
      console.log("Whatever...")
      return;
    }
    console.log("Bye Bye " + connected_user[index].username);
    connected_user.splice(index, 1);
    socket.emit("authorize", "KO")
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
