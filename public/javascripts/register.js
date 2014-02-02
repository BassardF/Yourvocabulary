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
			$('#login-group').removeClass('has-error');
			var login = $('#login').val();
			$.post("/register/loginAvailable", {login : login}, function(data){
				if(data[0].number !== 0){
					$('#login-group').addClass('has-error');
					setWarning('Login already in use.');
				}
			}, "json").fail(function() {});
		});

		$('#mail').blur(function(){
			$('#mail-group').removeClass('has-error');
			var mail = $('#mail').val();
			$.post("/register/mailAvailable", {mail : mail}, function(data){
				if(data[0].number !== 0){
					$('#mail-group').addClass('has-error');
					setWarning('mail already in use.');
				}
			}, "json").fail(function() {});
		});

		$('#register').hover(function(){
			$('#pass-group, #confirm-group').removeClass('has-success').removeClass('has-error');			
			var password = $('#password').val();
			var pass_confirm = $('#pass_confirm').val();
			if(pass_confirm !== password){
				$('#pass-group, #confirm-group').addClass('has-error');
				setWarning("Passwords doesn't match.");
			} else {
				$('#pass-group, #confirm-group').addClass('has-success');
			}
		});
	}
}

$(function(){
	INIT.setEvent();
});