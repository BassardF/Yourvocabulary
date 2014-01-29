// Inversed used data
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

// Fill linked data
function setNumbersOfChart(tab){
    var sum = 0,
        pattern = "<p>{libelle} : {value}</p>";
    for(var num in tab){
        var dom = pattern.replace("{libelle}", tab[num][0]).replace("{value}", tab[num][1]);
        $("#nowValues").append(dom);
        sum += tab[num][1];
    }    
    var total = pattern.replace("{libelle}", "Total").replace("{value}", sum);
    $("#nowValues").append(total);
}

// Draw the chart
function addChart(tab){
    var chart;
        $('#pieContainer').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: null
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: 'Quantity',
                data: tab
            }]
        });
    var tspanList = $("tspan"),
        toDelete = tspanList[tspanList.length-1];
    toDelete.remove();
}

// Requête les data et dessine le graphique + renseigne la légende
function getWordsNumberByTranslation(login){
     $.post("/stats/wordNumber", {login: login}, function(data){
        var tab = [];
        for(var num in data){
            var lang = languages[data[num].origin] + " to " + languages[data[num].destination];
            tab.push([lang, +data[num].qqt]);
        }
        addChart(tab);
        setNumbersOfChart(tab);            
  }, "json").fail(function() {
    $("#alertArea").text("A error occured");
    $("#alertArea").show();
  });
}

$(function () {
    $("#loading").hide();
    addChart();
    var login = $("#login").text();
    getWordsNumberByTranslation(login);
});