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
var rpsRef = database.ref("/RPS/game")
var messagesRef = database.ref("/RPS/messages");
var connectionsRef = database.ref("/RPS/connections");
var username, uid, opponentSpot, currentPlayers;
var playerSpot = -1;
var wins = 0;
var losses = 0;
var ties = 0;

$(function() {

    $("#signin").on("click", function(e){
        e.preventDefault();

        username = $("#username").val();
        $("#username").val("");

        var connect = connectionsRef.push({username: username});
        uid = connect.key;
        connect.onDisconnect().remove();

        $("#login-display").removeClass("show");
        $("#login-display").addClass("hide");
        $("#game").removeClass("hide");
        $("#game").addClass("show");

        if(currentPlayers){
            checkIfPlaying();
        }
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

                currentPlayers = snapKeys;
                checkIfPlaying();

            }
            else{
                $("#display").empty();
                $("#display").append($("<h3>").text("Waiting for an opponent"));           
            }

        }
    })

    messagesRef.on("child_added", function(snapshot) {
   
        var chatItem = $("<p>");
        chatItem.text(snapshot.val().message);
        $("#chat-display").append(chatItem);
        
    });

    rpsRef.on("value", function (snap) {
        if (playerSpot === 0 || playerSpot === 1) {
            if(snap.val()[opponentSpot]){
                var opponentChoice = snap.val()[opponentSpot].choice;
                var playerChoice = snap.val()[playerSpot].choice;
            }

            if (opponentChoice != "none" && playerChoice != "none") {
                if ((playerChoice === "rock" && opponentChoice === "scissors") ||
                (playerChoice === "paper" && opponentChoice === "rock") ||
                (playerChoice === "scissors" && opponentChoice === "paper")){
                    wins++;
                    $("#wins").text(wins);
                    $("#display").empty();
                    $("#display").append($("<h3>").text("You Win!"));
                    database.ref("/RPS/game/" + playerSpot).set({
                        choice: "none",
                    });
                    setTimeout(showRPS, 3000);
                }
                else if ((opponentChoice === "rock" && playerChoice === "scissors") ||
                        (opponentChoice === "paper" && playerChoice === "rock") ||
                        (opponentChoice === "scissors" && playerChoice === "paper")){
                    losses++;
                    $("#losses").text(losses);
                    $("#display").empty();
                    $("#display").append($("<h3>").text("You Lose!"));
                    database.ref("/RPS/game/" + playerSpot).set({
                        choice: "none",
                    });
                    setTimeout(showRPS, 3000);
                }
                else{
                    ties++;
                    $("#ties").text(ties);
                    $("#display").empty();
                    $("#display").append($("<h3>").text("You Tied!"));
                    database.ref("/RPS/game/" + playerSpot).set({
                        choice: "none",
                    });
                    setTimeout(showRPS, 3000);
                }
            }
        }
    })

    $("#chat-submit").on("click", function(e){
        e.preventDefault();
        var message = username + ": " + $("#chat-input").val();
        $("#chat-input").val("");
        messagesRef.push({
          message: message
        })
     
    });

    function showRPS(){
        $("#display").empty();
        var choices = $("<div>").addClass("row");
        var rockCol = $("<div>").addClass("col-4");
        var rock = $("<img>").attr("src", "assets/images/rock.png").attr("alt", "rock");
        rockCol.append(rock);
        var paperCol = $("<div>").addClass("col-4");
        var paper = $("<img>").attr("src", "assets/images/paper.png").attr("alt", "paper");
        paperCol.append(paper);
        var scissorsCol = $("<div>").addClass("col-4");
        var scissors = $("<img>").attr("src", "assets/images/scissors.png").attr("alt", "scissors");
        scissorsCol.append(scissors);

        choices.append(rockCol);
        choices.append(paperCol);
        choices.append(scissorsCol);
        $("#display").append(choices);
    }

    $("#display").on("click", "img", function(e){
        $("#display").empty();
        $("#display").append($("<h3>").text("Waiting on opponent..."));

        database.ref("/RPS/game/" + playerSpot).set({
            choice: $(this).attr("alt")
        })

    })

    function checkIfPlaying(){
        playerSpot = currentPlayers.indexOf(uid);
        if(playerSpot === 0){
            opponentSpot = 1;
        }
        else{
            opponentSpot = 0;
        }
        if(playerSpot != -1){
            database.ref("/RPS/game/" + playerSpot).set({
                choice: "none",
            })
            showRPS();
        }
        else{
            $("#display").empty();
            $("#display").append($("<h3>").text("Other players currently playing, please wait..."));
        }
    }

})