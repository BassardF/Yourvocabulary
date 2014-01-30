
/**
 * Module dependencies.
 */

var express = require('express');
var index = require('./routes');
var mysqlRequests = require('./routes/mysqlRequests');
var http = require('http');
var path = require('path');

var app = express();

/**
 * Configuration.
 */

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('19MYSECRETISSECRET89'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/**
 * Pages requests.
 */

app.get('/', function(req, res){
	if(req.session.membreId)
		res.redirect('/base');
	else
		index.index(req, res);
});

app.get('/register', function(req, res){
	if(req.session.membreId)
		res.redirect('/base');
	else
		index.register(req, res);
});

app.get('/base', function(req, res){
	if(req.session.membreId)
		index.base(req, res);
	else
		res.redirect('/');
});

app.get('/word', function(req, res){
	if(req.session.membreId)
		index.word(req, res);
	else
		res.redirect('/');
});

app.get('/lists', function(req, res){
	if(req.session.membreId)
		index.lists(req, res);
	else
		res.redirect('/');
});

app.get('/stats', function(req, res){
	if(req.session.membreId)
		index.stats(req, res);
	else
		res.redirect('/');
});

app.get('/about', function(req, res){
	if(req.session.membreId)
		index.about(req, res);
	else
		res.redirect('/');
});

app.get('/contact', function(req, res){
	if(req.session.membreId)
		index.contact(req, res);
	else
		res.redirect('/');
});

app.get('/disconnect', function(req, res){
	req.session.membreId = undefined;
	res.redirect('/');
});

/**
 * Services requests.
 */

app.post('/login', function(req, res){
	mysqlRequests.login(req, res, function(req, res){
		if(req.session.membreId)
			res.redirect('/base');
		else
			res.redirect('/');
	});
});


app.post('/register/register', function(req, res){
	if(req.session.membreId)
		res.redirect('/base');
	else
		mysqlRequests.register(req, res);
});

app.post('/lists/wordLists', mysqlRequests.wordLists);

app.post('/lists/deleteWord', mysqlRequests.deleteWord);

app.post('/word/addWord', mysqlRequests.addWord);

app.post('/stats/wordNumber', mysqlRequests.wordNumber);

app.post('/register/mailAvailable', mysqlRequests.mailAvailable);

app.post('/register/loginAvailable', mysqlRequests.loginAvailable);

/**
 * Server startup.
 */

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});