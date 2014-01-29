	
/*
 * Database interactions
 */

 var mysql = require('mysql');

 var databaseConf = {
 	host : '127.0.0.1',
 	port : '3306',
 	database : 'yourvocabulary',
 	socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock',
 	user : 'root',
 	password : 'root',
 	debug : 'false'
 }

/*
 * The id of a user
 */
 
 exports.login = function(req, res, next){
 	
 	var	connection = mysql.createConnection(databaseConf);
 	
 	connection.connect();
 	
 	var id = req.params.id || "";
 	var reqTemplate = 'SELECT * FROM membre WHERE login = ? and password = ?';
 	var request = mysql.format(reqTemplate, [req.body.login, req.body.password]);

 	connection.query(request, function(err, rows, fields){
 		
 		if(err) throw err;
 		
 		if(rows.length === 1){
 			req.session.membreId = rows[0].id;
 			req.session.login = rows[0].login;
 		}
 		
 		next(req, res);
 		
 	});
 	
 	connection.end();
 };

/*
 * Add a new user
 */
 
 exports.register = function(req, res){
 	
 	if(!req.body.login || !req.body.mail || !req.body.password || req.body.password !== req.body.pass_confirm){
 		
 		req.session.errorLvl = 'error';
 		req.Session.errorMessage = 'missing field';
 		res.redirect('/register');
 	
 	} else {
 		
 		var	connection = mysql.createConnection(databaseConf);
 		
 		connection.connect();
 		
 		var reqTemplate = 'INSERT INTO membre(login, mail, password) VALUES(?,?,?)';
 		var request = mysql.format(reqTemplate, [req.body.login, req.body.mail, req.body.password]);
 		
 		connection.query(request, function(err, rows, fields){
 			
 			if(err || !rows){
 				req.session.errorLvl = 'error';
 				req.session.errorMessage = 'An error occured.';
	 			res.redirect('/register');
 			} else if(rows && rows.insertId){
 				req.session.membreId = rows.insertId;
 				req.session.login = req.body.login;	
 				res.redirect('/base');
 			} else {
 				res.redirect('/');
 			}
 			
 		});
 		
 		connection.end();
 		
 	}
 };

/*
 * List of words for a specific user
 */
 
 exports.wordLists = function(req, res){
 	
 	var	connection = mysql.createConnection(databaseConf);
 	
 	connection.connect();
 	
 	var id = req.params.id || "";
 	var reqTemplate = 'SELECT * FROM words WHERE membre = ?';
 	var request = mysql.format(reqTemplate, [req.session.membreId]);
 	
 	connection.query(request, function(err, rows, fields){
 		
 		if(err) throw err;
		
 		res.set('Content-Type', 'application/json');
 		res.send(200, JSON.stringify(rows));
 		
 	});
 	
 	connection.end();
 	
 };

/*
 * Add a given translation to a given user
 */
 
 exports.addWord = function(req, res){
 	
 	if(req.body.text && req.body.translation && req.body.origin && req.body.destination && req.session.membreId){
 		
 		var	connection = mysql.createConnection(databaseConf);
 		
 		connection.connect();
 		
 		var reqTemplate = 'INSERT INTO words(text, translation, origin, destination, membre) VALUES(?,?,?,?,?)';
 		var request = mysql.format(reqTemplate, [req.body.text, req.body.translation, req.body.origin, req.body.destination, req.session.membreId]);
 		
 		connection.query(request, function(err, rows, fields){
 			
 			if(err){
 				res.set('Content-Type', 'application/json');
 				res.send(200, JSON.stringify("duplication"));
 			} else{
	 			res.set('Content-Type', 'application/json');
 				res.send(200, JSON.stringify(rows));
 			}
 			
 		});
 		
 		connection.end();
 	} else {
 		
 		res.set('Content-Type', 'application/json');
 		res.send(200, JSON.stringify("fail"));
 		
 	}
 	
 };

/*
 * Number of words by languages
 */

 exports.wordNumber = function(req, res){
 	
 	var	connection = mysql.createConnection(databaseConf);
 	
 	connection.connect();
 	
 	var reqTemplate = 'SELECT COUNT(id) as qqt, origin, destination FROM  words WHERE membre = ? GROUP BY origin, destination';
 	var request = mysql.format(reqTemplate, [req.session.membreId]);
 	
 	connection.query(request, function(err, rows, fields){
 		
 		if(err) throw err;

 		res.set('Content-Type', 'application/json');
 		res.send(200, JSON.stringify(rows));
 		
 	});
 	
 	connection.end();
 	
 };