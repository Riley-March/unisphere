var mysql = require('mysql');
var connection;
var testConnection;

function dbConnect(){
	connection = mysql.createConnection({
		host: 'mySQL18.webland.ch',
		user: 'cyber_mydb',
		password:  'Sidiboy8',
		database:  'cyber_mydb'
	});
	console.log("Database Connected");
}

//function testDbConnect(){
//	connection = mysql.createConnection({
//		host: 'db4free.net',
//		user: 'falkners',
//		password: 'wolverine',
//		database: 'forum20'
//	});
//	console.log("Database Connected");
//}
function getProfiles(callback){
	connection.query('SELECT * FROM uni_users', function(err, rows){
		callback(rows);
	});
}

function loadProfile(id, callback){
	connection.query("SELECT * FROM uni_users WHERE USER_ID = (?)", [id], function(err, rows){
		callback(rows);
	});
}

function getPosts(callback){
	connection.query('SELECT * FROM uni_posts', function(err, rows){
		callback(rows);
	});
}

function addUser(person){
	connection.query("INSERT INTO uni_users (USER_EMAIL, USER_NAME, USER_ALIAS, USER_DESCRIPTION, USER_KEYPIN, USER_EMAIL_FRAG) VALUES (?,?,?,?,?,?)",
	[person.email, person.name, person.alias, person.description, person.keycode, person.emailFrag], function(err){
		if(err){
			console.log(err);
		}
	});
}

function newPost(post){
	connection.query("INSERT INTO uni_posts (POST_USERNAME, POST_TEXT, POST_TIME, POST_EMAIL_FRAG, POST_IMG, POST_EMAIL) VALUES (?,?,?,?,?,?)",
			[post.name, post.message, post.time, post.emailFrag, "", post.email], function(err){
		if(err){
			console.log(err);
		}
	});
}

function authenticateUser(email, password, callback){
	connection.query("SELECT * FROM uni_users WHERE USER_EMAIL = (?) and USER_KEYPIN = (?)", [email, password], function(err, rows){
		callback(rows);
	});
}

function confirmCode(email, keypin, callback){
	connection.query("SELECT * FROM uni_users WHERE USER_EMAIL = (?) AND USER_KEYPIN = (?)", [email, keypin], function(err, rows){
		callback(rows);
	})
}

exports.dbConnect = dbConnect;
//exports.testDbConnect = testDbConnect;
exports.getProfiles = getProfiles;
exports.getPosts = getPosts;
exports.addUser = addUser;
exports.newPost = newPost;
exports.loadProfile = loadProfile;
exports.authenticateUser = authenticateUser;
exports.confirmCode = confirmCode;