var db;
const MongoClient = require('mongodb').MongoClient;

function connectDB(){
    MongoClient.connect('mongodb://ramtek:unisphere@ds161485.mlab.com:61485/unishphere', (err, database) => {
        if(err) return console.log(err); 
        db = database;
        console.log("Database Connected");
    });
}

function addUser(person, callback) {
    db.collection('users').save(person, (err, result) => {
        if(err){
            callback(err);
        }
    });
}

function checkEmail(email, callback){
    db.collection('users').find({email: email}).toArray(function(err, results){
        var userExists = true;
        if(err){
            console.error(err.stack);
            callback(err, null);
        }else{
            if(results.length === 0){
                userExists = false;
                callback(null, userExists);
            }else{
                callback(null, userExists);
            }
        }
    });
}

function confirmKeypin(email, keypin, callback) {
    db.collection('users').find({email: email, keypin: keypin}).toArray(function(err, results){
        var keypinCorrect = true;
        if(err){
           console.error(err.stack);
           callback(err, null);
        }else{
            if(results.length === 0){
                userExists = false;
                callback(null, keypinCorrect);
            }else{
                callback(null, keypinCorrect);
            }
        }
    });
}

function loginUser(email, password, callback) {
    db.collection('users').find({email: email, password: password}).toArray(function(err, results){
       var loginCorrect = true;
       if(err){
           console.error(err.stack);
           callback(err, null);
       }else{
            if(results.length === 0){
                loginCorrect = false;
                callback(null, loginCorrect, null);
            }else{
                callback(null, loginCorrect, results);
            }
        }
    });
}

function getPosts(emailFrag, callback) {
    db.collection('posts').find({emailFrag: emailFrag}).toArray(function(err, results){
        if(err){
            console.error(err.stack);
        }else{
            callback(results);
        }
    });
}

function newPost(post, callback) {
    db.collection('posts').save(post, (err, result) => {
        if(err){
            callback(err);
        }
    });
}


function getEvents(emailFrag, callback) {
    db.collection('events').find({emailfrag: emailFrag}).toArray(function(err, results){
        if(err){
            console.error(err.stack);
        }else{
            callback(results);
        }
    });
}

function newEvent(event){
    db.collection('events').save(event, (err, result) => {
        if(err){
            console.log(err);
        } 
    });
}

function getPeople(emailFrag, callback){
    db.collection('users').find({emailFrag: emailFrag}).toArray(function(err, results){
        if(err){
            console.error(err.stack);
        }else{
            callback(results);
        }
    });
}

function checkUserProfileVoted(profiles, email, callback){
    db.collection('votes').find({email: email}).toArray(function(err, results){
        var newProfiles = [];
        for(var i = 0; i < profiles.length; i++){
            profiles[i].hasVoted = 0;
            for(var j = 0; j < results.length; j++){
                if(profiles[i].USER_ID === results[j].USER_ID){
                    profiles[i].hasVoted = 1;
                }
            }
            newProfiles[newProfiles.length] = profiles[i];
        }
        callback(newProfiles);
    });
}

function getProfile(email, callback){
    db.collection('users').find({email: email}).toArray(function(err, results){
        if(err){
            console.error(err.stack);
        }else{
            callback(results); 
        }
    });
}

function updateProfile(user, callback){
    db.collection('users').update({email: user.email}, {$set: {name: user.name, alias: user.alias, description: user.description}}, (err, result) => {
        if(err){
            console.log(err);
        }
        callback(result);
    });
}

exports.connectDB = connectDB;
exports.addUser = addUser;
exports.checkEmail = checkEmail;
exports.confirmKeypin = confirmKeypin;
exports.loginUser = loginUser;
exports.getPosts = getPosts;
exports.newPost = newPost;
exports.getEvents = getEvents;
exports.newEvent = newEvent;
exports.getPeople = getPeople;
exports.getProfile = getProfile;
exports.updateProfile = updateProfile;