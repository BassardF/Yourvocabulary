
/*
 * GET page routing.
 */

exports.index = function(req, res){
  res.render('index.ejs');
};

exports.register = function(req, res){
	var level = req.session.errorLvl || 'none';
	var message = req.session.errorMessage || '';
	req.session.errorLvl = 'none';
	req.session.errorMessage = '';
  	res.render('register.ejs', {
  		errorLvl : level,
  		errorMsg : message
  	});
};

exports.base = function(req, res){
  res.render('base.ejs', {login : req.session.login});
};

exports.lists = function(req, res){
  res.render('lists.ejs', {login : req.session.login});
};

exports.word = function(req, res){
  res.render('word.ejs', {login : req.session.login});
};

exports.stats = function(req, res){
  res.render('stats.ejs', {login : req.session.login});
};

exports.about = function(req, res){
  res.render('about.ejs', {login : req.session.login});
};

exports.contact = function(req, res){
  res.render('contact.ejs', {login : req.session.login});
};