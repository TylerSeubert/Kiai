//mongodb handler module. 
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/atariDB';


 //insert new user into collection.
exports.atariNewUser = function(form){

    MongoClient.connect(url,function(err,db){
        if(err){
            throw err;
        }
        const atariDB = db.db("atariDB");

        //initialize variables
        let fname = form.fName;
        let lname = form.lName;
        let username = form.userName;
        let email = form.email;
        let password = form.password;
        
        atariDB.collection('users').insertOne({
            fName:fname,
            lName:lname,
            userName:username,
            email:email,
            password:password,
            rank: 0,
            games: {
                wins: 0,
                losses: 0,
            }
        });

        db.close();
    });
}

//query to find user information
exports.atariFindUser = function(user, callBack){

    MongoClient.connect(url,function(err,db){
        if(err){
            throw err;
        }
        
        const atariDB = db.db("atariDB");
        console.log("connected to atariFindUser!");

    //initialize search parameters.
    let username = user.userName;
    let password = user.password;

    //query database for username and password.
    atariDB.collection("users").find({userName: username},(queryErr,results)=>{
        if(queryErr){
            throw queryErr;
        }
        results.forEach(user => {
            if(user.userName === username && user.password === password){
                callBack(null,user);
            }
        });
    });
});
}
