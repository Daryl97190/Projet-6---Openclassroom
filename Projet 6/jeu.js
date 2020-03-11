import {Grille} from "./grille.js";

$(document).ready(function(){ // méthode qui permet d'exécuter du code JavaScript après que le DOM est fini de chargé
    $("#nouvellePartie").click(function(){
        $("article").show();
        $("#terminerMonTour").show();
        $("#grilledujeu").show();
        $("#nouvellePartie").hide();
        new Grille;
    }) 
    $("#regle").click(function() {
        $("#backgroundpopUp").show()
        $("#bouttonfermer").click(function(){
            $("#backgroundpopUp").hide()
        })
    });
});

  
