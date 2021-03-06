// Used languages list
var languages = {
  "en" : "English",
  "fr" : "French",  
  "de" : "German",
  "es" : "Spanish",
  "it" : "Italian",
  "nl" : "Dutch",
  "pt" : "Portuguese",
  "da" : "Danish",
  "fi" : "Finnish",
  "no" : "Norwegian",
  "sv" : "Swedish"
};

// Format the title to be displayed : input =  "en | fr" output = "English to French".
var createTitleFromLanguages = function(basic){
  var array = basic.split(" | ");
  return languages[array[0]] + " to " + languages[array[1]];
}

// Add an element to the nav.
// Click to display the according list.
// Pannel'is is related to list id (to be displayed)
var addNav = function(id, badge, title){
  var pattern = '<li class="list-group-item" id="{id}"><span class="badge">{badge}</span>{title}</li>';
  pattern = pattern.replace("{id}",id).replace("{badge}",badge).replace("{title}",title);
  $("#summary").append(pattern);
  $("#"+id).click(function(){
    $('.selected-menu').removeClass('selected-menu');
    $("#"+id).addClass('selected-menu');
    $('.panel-default').hide();
    $("#"+title.replace(/\s/g, "-")).show();
  });
}

// Add a new list (language to another)
var addAList = function(number, list){
  if(!list || !number) return;
  var listeId = list.language.replace(" | ", ""),
  listeTitleShow = createTitleFromLanguages(list.language),
  listeTitle = listeTitleShow.replace(/\s/g, "-"),
  accordTemplate = "<div id=\"{click}\" class=\"panel panel-default\"><div class=\"panel-heading\"><h4 class=\"panel-title\"><a data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#{id}\">{title}</a></h4></div><div id=\"{id}\" class=\"panel-collapse collapse in\"><div class=\"panel-body\">{body}</div></div></div>",
  tableTemplate = "<table class=\"table table-hover\"><thead><tr><th>#</th><th>Word</th><th>Translation</th><th>Delete</th></tr></thead><tbody>{body}</tbody></table>",
  rowTemplate = "<tr><td>{number}</td><td>{word}</td><td>{translation}</td><td><img id=\"{picid}\" class=\"delete-pic\" src=\"/images/delete.png\"></td></tr>",
  rows = "",
  i = 1;
  addNav(listeId, list.words.length,listeTitleShow);
  list.words.reverse();
  for(var num in list.words){
    rows += rowTemplate.replace("{number}", i).replace("{word}", list.words[num].text).replace("{translation}",list.words[num].translation).replace("{picid}",list.words[num].text + ';' + list.words[num].translation);
    i++;
  }
  tableTemplate = tableTemplate.replace("{body}", rows);
  accordTemplate = accordTemplate.replace(/{id}/g, number).replace("{title}", listeTitleShow).replace("{body}",tableTemplate).replace("{click}", listeTitle);
  $("#accordion").append(accordTemplate);
}

// Format the JSON and add the the data
var sortAndAddList = function(data){
  var num = 0;
  while(data.length > 0){
    var word = data.pop(),
    liste = {},
    tempTab = [];
    liste.language = word.origin + " | " + word.destination;
    liste.words = [];
    liste.words.push(word);
    while(data.length > 0){
      var word2 = data.pop();
      if(word2.origin === word.origin && word2.destination === word.destination){
        liste.words.push(word2);
      } else
      tempTab.push(word2);
    }
    data = tempTab.slice();
    tempTab = [];
    addAList(++num, liste);
  }
  $("#loading").hide();
  $("#summary > li:first-child").click();
}

// Get the Whole list of words
var getListRequest = function(){
  $.post("/lists/wordLists", function(data){
    if(data === "empty"){
      $("#alerArea").text("No records has been found for your login.");
      $("#alerArea").show();
    }
    else if (data === "error"){
      $("#alerArea").text("An error occured.");
      $("#alerArea").show();
    }
    else
      sortAndAddList(data);
  }, "json").fail(function() {
    $("#alerArea").text("An error occured.");
    $("#alerArea").show();
  });
}

// Every event that can be setted at the load
var setEventsInit = function(){
  // Fill and show the modal
  $(document).on('click', '.delete-pic', function() {
    var splitted = this.id.split(';');
    var word = splitted[0];
    var translation = splitted[1];
    var langs = $('.selected-menu').attr('id');
    var origin = langs.substr(0,2);
    var destination = langs.substr(2,4);
    $("#word-to-delete").text(word);
    $("#translation-to-delete").text(translation);
    $("#origin-to-delete").text(origin);
    $("#destination-to-delete").text(destination);
    $('#delete-modal').modal("show");
  });
  // Delete when the "delete" of the modal is pressed
  $("#delete-button").click(function(){
    var text = $("#word-to-delete").text();
    var translation = $("#translation-to-delete").text();
    var origin = $("#origin-to-delete").text();
    var destination = $("#destination-to-delete").text();
    $.post("/lists/deleteWord", {
      text : text,
      translation : translation,
      origin : origin,
      destination : destination
    },function(data){
      location.reload(true);
    }, "json").fail(function() {
    });
    $('#delete-modal').modal("hide");
  });
}

$(function(){
  setEventsInit();
  getListRequest();
});