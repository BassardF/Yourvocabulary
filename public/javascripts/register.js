var setWarning = function(label){
	$('#alert').text(label);
	$('#alert').show();
	setTimeout(function(){
		$('#alert').hide()
	}, 4000);
}

var INIT = {
	setEvent : function(){
		$('#login').blur(function(){
			var login = $('#login').val();
			$.post("/register/loginAvailable", {login : login}, function(data){
				if(data[0].number !== 0){
					setWarning('Login already in use.');
				}
			}, "json").fail(function() {});
		});

		$('#mail').blur(function(){
			var mail = $('#mail').val();
			$.post("/register/mailAvailable", {mail : mail}, function(data){
				if(data[0].number !== 0){
					setWarning('mail already in use.');
				}
			}, "json").fail(function() {});
		});
	}
}

$(function(){
	INIT.setEvent();
});