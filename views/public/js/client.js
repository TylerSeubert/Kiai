"use stritct";
//var io = require('socket.io');
$(document).ready(()=>{
    //initialize variables for switch statement.
    let currentTitle = document.title;
    let indexTitle = "Atari";
    let lobbyTitle = "Game Lobby";
    let confirmationTitle = "Confirmation"; 

    //main switch statement to handle different code for each page.
    switch(currentTitle){
        case indexTitle : 
            index();
            break;
        case lobbyTitle : 
            lobby();
            break;
        case confirmationTitle:
            confirmation();
    }

    //remember to change 'localhost' to domain name when in production.

    function index(){

        $("#gameBtn").click(()=>{
            window.location.href = 'http://localhost:3000/game';
         });//end of gameBTN onclick handler.
     
         $("#aboutBtn").click(()=>{
             window.location.href = 'http://localhost:3000/about';
         })//end of aboutBTN onclick event handler.
     
         $("#lobbyBtn").click(()=>{
             window.location.href = 'http://localhost:3000/lobby';
         });//end of lobbyBTN onclick event handler.
        
         //BUTTON ANIMATIONS//

         //lobbybtn
        $("#lobbyBtn").mouseover(()=>{
            $("#matchIcon").stop(true,true).fadeOut(1000)
            $("#matchSpan").delay(1000).fadeIn(1500);
        });
         $("#lobbyBtn").mouseleave(()=>{
            $("#matchSpan").stop(true,true).fadeOut(1000)
            $("#matchIcon").delay(1000).fadeIn(1500);
         });

         //homebtn
        $("#homeBtn").mouseover(()=>{
            $("#homeIcon").stop(true,true).fadeOut(1000)
            $("#homeSpan").delay(1000).fadeIn(1500);
        });
        $("#homeBtn").mouseleave(()=>{
            $("#homeSpan").stop(true,true).fadeOut(1000)
            $("#homeIcon").delay(1000).fadeIn(1500);
        });
        $("#homeBtn").click(()=>{
            window.location.href = 'http://localhost:3000';
        });

         //guidebtn
        $("#guideBtn").mouseover(()=>{
            $("#guideIcon").stop(true,true).fadeOut(1000)
            $("#guideSpan").delay(1000).fadeIn(1500);
        });
        $("#guideBtn").mouseleave(()=>{
            $("#guideSpan").stop(true,true).fadeOut(1000)
            $("#guideIcon").delay(1000).fadeIn(1500);
        });

        //logInbtn
        $("#logInBtn").mouseover(()=>{
            $("#logInIcon").stop(true,true).fadeOut(1000)
            $("#logInSpan").delay(1000).fadeIn(1500);
        });
        $("#logInBtn").mouseleave(()=>{
            $("#logInSpan").stop(true,true).fadeOut(1000)
            $("#logInIcon").delay(1000).fadeIn(1500);
        });

        $("#logInBtn").click(()=>{
            document.getElementById('logInOverlay').style.height = '100%';
        });
        
        //createAccountBtn
        $("#createBtn").mouseover(()=>{
            $("#createIcon").stop(true,true).fadeOut(1000)
            $("#createSpan").delay(1000).fadeIn(1500);
        });
        $("#createBtn").mouseleave(()=>{
            $("#createSpan").stop(true,true).fadeOut(1000)
            $("#createIcon").delay(1000).fadeIn(1500);
        });

        //aboutbtn
        $("#aboutBtn").mouseover(()=>{
            $("#aboutSpan").stop(true,true).fadeIn(1000);
        });
        $("#aboutBtn").mouseleave(()=>{
            $("#aboutSpan").stop(true,true).fadeOut(1000);
        });

        //registration overlay
        $("#createBtn").click(()=>{
            document.getElementById('registerOverlay').style.height = "100%";
        });

        $("#backOverlayBtn").click(()=>{
            document.getElementById('registerOverlay').style.height = "0%";
        });

        $("#backLogInBtn").click(()=>{
            document.getElementById('logInOverlay').style.height = "0%";
        });

        $("#logInFormBtn").click(()=>{
            console.log("clicked!");
            let userName = $('#userNameLogIn').val();
            let password = $("#passwordLogIn").val();
            $.ajax({
                url: 'http://localhost:3000/logIn',
                method: 'POST',
                data: {userName:userName,password:password},
                success:(data)=>{
                    document.getElementById('h1Name').innerHTML = data.userName;
                    document.getElementById('h1Name').style.color = "purple";
                    document.getElementById('logInOverlay').style.height = "0%";
                    $('#infoList').append('<li>' + "Rank: " + 
                    data.rank +  '<li> <br>');
                    $('#infoList').append('<li>' + "Wins: " + 
                    data.games.wins +  '<li> <br>');
                    $('#infoList').append('<li>' + "Losses: " + 
                    data.games.losses +  '<li> <br>');
                    $("#playerInfo").fadeIn(2000);
                }
            });
        });

    } //end of index function. 


    //FIND MATCH FUNCTION//

    function lobby(){

        //initialize variables
        let socket = io();
        let playerName = '';

        $("#findMatchBtn").click(()=>{
            playerName = $("#userName").val();
            findMatch(playerName);
    
            //clears textbox after input
            document.getElementById("userName").value = "";
            document.getElementById("lobbyBody").style.backgroundColor = 'grey';
            $("#lobbyWrapper").fadeOut(2000);
            $("#chatDiv").fadeIn(2000);
            game();
        });

        $("form").submit(()=>{
            socket.emit('chat message', $('#m').val());
            $('#m').val('');
            return false;
        });

        function findMatch(userName){
            socket.emit('findMatch',{playerName: userName});
        };

        //socket events
        socket.on('joinedMatch', (data)=>{
            $('#messages').append('<li>' + 
            data +  '<li> <br>');
            
        });
        
        socket.on('player2Join',(data)=>{
            $('#messages').append('<li>' + 
            data +  '<li> <br>');
        });

        socket.on('chat message', function(msg){
            $('#messages').append($('<li>').text(msg.player + ": " + msg.msg));
          });

        function game(){
            $("#gameArea").fadeIn(2000);
            //all of the game function I took from an API called Wgo.js
            var board = new WGo.Board(document.getElementById("board"), {
                width: 500
            });
            var tool = document.getElementById("tool"); // get the <select> element

            board.addEventListener("click", function(x, y) {
                if(tool.value == "black") {
                    board.addObject({
                        x: x,
                        y: y,
                        c: WGo.B
                    });
                }
                else if(tool.value == "white") {
                    board.addObject({
                        x: x,
                        y: y,
                        c: WGo.W
                    });
                }
                else if(tool.value == "remove") {
                    board.removeObjectsAt(x, y);
                }
                else {
                    board.addObject({
                        x: x,
                        y: y,
                        type: tool.value
                    });
                }
            });
        }
    } //end of find match function.

    function confirmation(){
          //tohomebtn
          $(".toHomeBtn").click(()=>{
            window.location.href = 'http://localhost:3000';
        });
    }

}); // end of document.ready. 

