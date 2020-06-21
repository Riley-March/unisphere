var express = require('express');
var multer = require('multer');
var body_parser = require('body-parser');
var path = require('path');
var jwt = require('jsonwebtoken');

var db = require('./database.js');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(body_parser.urlencoded({ extended: true }));
app.use(body_parser.json());

app.get('/*', function(req, res){
    res.sendFile('hmtl/index.html');
});

app.post('/authenticate', function(req, res){
    db.loginUser(req.body.email, req.body.password, function(err, loginCorrect, result){
        if(loginCorrect){
            var tokenData = {
                id: result[0]._id,
                email: result[0].email,
                name: result[0].name,
                emailFrag: result[0].emailFrag
            };
            var token = jwt.sign(tokenData, 'this is the secret');
            req.session.user = token;
            res.status(200).json({token: token});
        }else{
            res.status(400).send("Incorrect Username/Password");
        }                                                    
    });
});

app.post('/logout', function(req, res){
    req.session.user = null;
    res.status(200).send("Logged Out");
});

app.post('/addUser', multer({dest: './public/images/'}).single('avatar'), function(req, res){
	var keypin = Math.floor((Math.random() * 8999) + 1000);
	var email = req.body.email;
	var emailFrag = email.split("@", 2);
	var user = {
			email: req.body.email,
			name: req.body.name,
			alias: req.body.alias,
			description: req.body.description,
			password: keypin.toString(),
			emailFrag: emailFrag[1]
	};
    require("fs").writeFile("./public/images/out.png", req.body.avatar.data, 'base64', function(err) {
        console.log(err);
    });
	/*db.checkEmail(user.email, function(err, userExists){
        if(userExists){
			res.status(400).send("Email Already Exists");
		}else{
			db.addUser(user);
			res.status(200).json({keypin: keypin});
		}
	});*/
});

app.post('/loadPosts', function (req, res) {
	var decodedToken = jwt.decode(req.body.token);
	db.getPosts(decodedToken.emailFrag, function(posts){
		res.status(200).json(posts);
	});
});

app.post('/newPost', function (req, res) {
	var time = new Date();
	var decodedToken = jwt.decode(req.body.token);
	var post = {
		username: decodedToken.name,
		userID: decodedToken.id,
		text: req.body.message,
		time: time.getTime(),
		emailFrag: decodedToken.emailFrag,
		email: decodedToken.email
	};
	db.newPost(post);
    res.status(200).json(post);
});

app.post('/loadEvents', function (req, res) {
	var decodedToken = jwt.decode(req.body.token);
	db.getEvents(decodedToken.emailFrag, function(events){
		res.status(200).json(events);
	});
});

app.post('/newEvent', function(req, res){
    var decodedToken = jwt.decode(req.body.token);
    var event = {
        username: decodedToken.name,
        userId: decodedToken.id,
        emailfrag: decodedToken.emailFrag,
        name: req.body.name,
        description: req.body.description,
        time: req.body.time
    };
    db.newEvent(event);
    res.status(200).json(event);
});

app.post('/loadPeople', function (req, res) {
	var decodedToken = jwt.decode(req.body.token);
	db.getPeople(decodedToken.emailFrag, function(people){
		res.status(200).json(people);
	});
});

app.post('/loadProfile', function (req, res) {
	var decodedToken = jwt.decode(req.body.token);
	db.getProfile(decodedToken.email, function(profile){
        res.status(200).json(profile);
    });
});

app.post('/updateProfile', function(req, res){
    var decodedToken = jwt.decode(req.body.token);
	var user = {
		email: decodedToken.email,
		name: req.body.user.name,
		alias: req.body.user.alias,
		description: req.body.user.description
	};
	db.updateProfile(user, function(result){
        if(result){
            res.status(200).send("Profile Updated");
        }else{
            res.status(400).send("An error occured. Try again later");
        }
    });
});

app.post('/userStatus', function(req, res){
    if(!req.session.user){
        return res.status(200).json({user: false});
    }
    res.status(200).json({user: true});
});

app.listen(3000, () => {
    db.connectDB();
    console.log("Listening on port 3000");        
});