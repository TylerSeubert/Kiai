"use strict";
var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);  
var io = require('socket.io')(http); 
var bodyParser = require('body-parser');
var db = require('./myLib/dbHandler');

app.use(bodyParser.urlencoded({ extended: false }));
app.set('port',process.env.PORT || 3000);
//serves static files.
app.use(express.static(path.join(__dirname, 'views/public'))); //link html file paths relative to this path, so js/client.js,etc.

//routes
app.get('/',(req, res)=>{
    res.sendFile(__dirname + '/index.html');
});
app.get('/lobby', (req,res)=>{
    res.sendFile(__dirname + '/views/lobby.html');
});
app.get('/game', (req, res)=>{ 
    res.sendFile(__dirname + '/views/game.html');
});
app.get('/about',(req,res)=>{
    res.sendFile(__dirname + '/views/about.html');
});
app.post('/logIn',(req,res)=>{

    let userLogin = req.body;

   db.atariFindUser(userLogin, function(err,result){
        res.send(result);
   });
});

app.post('/register',(req,res)=>{
    //insert new user into database
    let form = req.body;
    db.atariNewUser(form);

    //after successful data entry, send confirmation page, letting user know they registerd.
    res.sendFile(__dirname + '/views/confirmation.html');
});

//game object to hold all games being played by users.
class gameCollection {
    constructor(){
        if(!gameCollection.instance){
            this.totalgameCount = 0;
            this.gameList = [];
            gameCollection.instance = this;
        }
        else{
        return gameCollection.instance;
        } 
    }

    totalGames(){
        return this.totalgameCount;
    }

    addGameCount(){
        this.totalgameCount += 1;
    }

    addGame(game){
        this.gameList.push(game);
    }

    getGameList(){
        return this.gameList;
    }

    updateGameList(currentList){
        this.gameList = currentList;
    }

    //add update game list function.

} //end of class declaration

//instantiate singleton
var gameHandler = new gameCollection();
console.log(gameHandler.totalGames());

//socket.io events.
io.on('connection', function(socket){
    console.log('a user connected!');

    //finds match for user.
    socket.on('findMatch', (data)=>{
        socket.name = data.playerName;
        console.log(socket.name);
        //check for open games. if no open games, create one;
        let tempGameList = gameHandler.getGameList();
        let gameCount = gameHandler.totalGames();
        let openGames = false;

        //check for open games.
        tempGameList.forEach(element => {
            if(element.open === true){
                openGames = true;
            }
        });

        if(gameCount < 1 || openGames === false){
        
            //create new game.
            var gameObject = {};

            //creates game room id
            gameObject.room = socket.id;

            //creates player 1 and 2 data.
            gameObject.player1 = data.playerName;
            console.log(gameObject.player1);
            gameObject.player2 = null;
            gameObject.open = true;
            
            //adds game to gameList.
            gameHandler.addGame(gameObject);

            //increase gameCount.
            gameHandler.addGameCount();

           console.log("everything is coolie5g");
           let tempGameList = gameHandler.getGameList();
           console.log(tempGameList[0].room);
           socket.join(gameObject.room, ()=>{
               io.to(gameObject.room).emit('joinedMatch', "You joined a match! Waiting for an opponent to join...");
           });
        }
        //else find open game to join
        else{

            //sets number of games in list.
            let gameCount = gameHandler.totalGames();

            //gets current gameList data.
            let tempGameList = gameHandler.getGameList(); 

            //used to store open games in, so we can randomly pick one for player2 to enter.
            let tempArray = []; 

            //loop through entire gamelist to check for open games;
            console.log("looking for games...");

            for(let i = 0; i < gameCount; i++){
                if(tempGameList[i].open === true){
                    let tempGameObject = tempGameList[i];
                    tempArray.push({tempGameObject});
                }
            }

            console.log("selecting random opponent...");
            //select random opponent.
            let randomNumber = Math.floor(Math.random() * Math.floor(tempArray.length));

            console.log("game " + tempArray[randomNumber].tempGameObject.player1 + " was selected! Preparing to join game...");

            //store socket.id in var
            var selectId = tempArray[randomNumber].tempGameObject.room;
            console.log(selectId);

            // find selected oppponent in gamecollection (using socket.id as roomId)
            for(var i = 0; i < gameCount; i++){
                //if socket.ids match, add player2 to gameroom.
                if(selectId === tempGameList[i].room){
                    socket.join(selectId, ()=>{
                        io.to(selectId).emit('player2Join', data.playerName + ' joined match!');
                    });
                    //update current game.
                    console.log(gameHandler);
                    tempGameList[i].open = false;
                    tempGameList[i].player2 = data.playerName;
                }
            }
            //put current gamelist into gameHandler.
            gameHandler.updateGameList(tempGameList);
            console.log(gameHandler);
        }
    });

    socket.on('chat message',(msg)=>{
        let gl = gameHandler.getGameList();
        gl.forEach(game => {
            if(socket.name === game.player1 || socket.name === game.player2){
                let message = {
                    player: socket.name,
                    msg: msg
                }
                io.to(game.room).emit('chat message',message);
            }
        });
    });

    socket.on('disconnect', ()=>{
      console.log('a user disconnected!'); 
    });
});

http.listen(app.get('port'), ()=>{
    console.log("Express started on localhost: " + app.get('port') + ' press ctrl + c to terminate');
});
