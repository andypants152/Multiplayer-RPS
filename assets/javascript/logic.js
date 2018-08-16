  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCxz9W5MEmyoCv5-ik3r-82RQ8n_kUdyW0",
    authDomain: "bootcamp-prod.firebaseapp.com",
    databaseURL: "https://bootcamp-prod.firebaseio.com",
    projectId: "bootcamp-prod",
    storageBucket: "bootcamp-prod.appspot.com",
    messagingSenderId: "904953598925"
  };
  firebase.initializeApp(config);

var database = firebase.database();
var rpsRef = database.ref("/RPS")
var messagesRef = database.ref("/RPS/messages");
var connectionsRef = database.ref("/RPS/connections");
var username;

$(function() {

    $("#signin").on("click", function(e){
        e.preventDefault();

        username = $("#username").val();
        $("#username").val("");

        var connect = connectionsRef.push({username: username});

        connect.onDisconnect().remove();

        $("#login-display").removeClass("show");
        $("#login-display").addClass("hide");
        $("#game").removeClass("hide");
        $("#game").addClass("show");
    })

    connectionsRef.on("value", function(snap){
        if(snap.val()){
            snapKeys = Object.keys(snap.val());
            var users = snap.val();
            $("#queue").empty();
            for(var i = 0; i < snapKeys.length; i++){
                
                $("#queue").append($("<h5>").text(users[snapKeys[i]].username));
            }

        }

    })

    connectionsRef.limitToFirst(2).on("value", function(snap){
        if(snap.val()){
            snapKeys = Object.keys(snap.val());
            if(snapKeys.length === 2){
                console.log("Let's play!");
            }
        }
    })

    messagesRef.on("child_added", function(snapshot) {
   
        var chatItem = $("<p>");
    
        chatItem.text(snapshot.val().message);

        $("#chat-display").append(chatItem);
        
    
    });

    $("#chat-submit").on("click", function(e){
        e.preventDefault();
    
        var message = username + ": " + $("#chat-input").val();
        $("#chat-input").val("");
        
        messagesRef.push({
          message: message
        })
      
      
     
    });

})