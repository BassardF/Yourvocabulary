// Used languages
var languages = {
	"English" : "en",
	"French" : "fr",	
	"German" : "de",
	"Spanish" : "es",
	"Italian" : "it",
	"Dutch" : "nl",
	"Portuguese" : "pt",
	"Danish" : "da",
	"Finnish" : "fi",
	"Norwegian" : "no",
	"Swedish" : "sv"
};

// Fill the DOM with the used languages
var fillOptions = function(){
	for(var lan in languages){
		var html = "<option>" + lan + "</option>";		
		$("#origin").append(html);
		$("#destination").append(html);
	}
	$('#destination').val('French');
}

// Use the erxternal API to auto translate
var translate = function(text, from, to){
	var pair = languages[from] + "|" + languages[to];
	$.get( "http://api.mymemory.translated.net/get", { langpair: pair, q: text } )
		.done(function( data ) {
		$("#result").val(data.responseData.translatedText);
	});
}


// Register word & translation
var storeTranslation = function(login, text, translation, origin, destination){
	$.post( "/word/addWord",
		{text: text ,
		 translation: translation ,
		 origin: origin ,
		 destination: destination}
	)
  	.done(function(data) {
  		if(data && data.affectedRows == "1")
    		$("#alerArea").text("Your word has successfully been added.");
    	else
    		$("#alerArea").text("An error occured.");
    	$("#alerArea").show();
  }).fail(function() {
    	$("#alerArea").text("An error occured.");
    	$("#alerArea").show();
  });
}

// Loading events
var setEvents = function(){
	$("#translate").click(function(){
		var text = $("#word").val(),
			from = $("#origin").val(),
			to = $("#destination").val();
		translate(text, from, to);
	});
	$("#store").click(function(){
		var login = $("#login").text(),
			text = $("#word").val(),
			translation = $("#result").val(),
			origin = languages[$("#origin").val()],
			destination = languages[$("#destination").val()];
		storeTranslation(login, text, translation, origin, destination);
		$("#word, #result").val("");
	});
}

// Dom loaded

$(function(){
	fillOptions();
	setEvents();
});