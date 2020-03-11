import { Arme } from "./arme.js";
export class Joueur{
    constructor(nom, sante,arme, coordonnees, css,idDescription){
        this.nom = nom;
        this.sante = sante;
        this.arme = arme
        this.defense = false;
        this.coordonnees =  coordonnees;
        this.css = css 
        this.idDescription = idDescription;
        this.armeEquipee = new Arme("Poing-americain",10);
        this.descriptionJoueur();
    }  
    joueurEstBlesse(degat) {
        //Gestion d'un joueur touché//
        if (this.defense === true){
            this.sante = this.sante - (degat/2);
            this.defense = false;
        }
        else {
            this.sante = this.sante - degat;
        }
    } 
    seDefend() {
        // Gestion de la défense des joueurs
        this.defense = true;
        document.getElementById('infosAttaque').innerHTML = "";
        let phraseDefense = document.createElement("p"); 
        phraseDefense.textContent = this.nom + " se défend.";
        document.getElementById("infosAttaque").appendChild(phraseDefense);
        return this.defense;
    }
    attaque(joueurAdverse) {
        // Gestion du combat des joueurs
        this.defense = false;
        joueurAdverse.joueurEstBlesse(this.armeEquipee.degat);
        document.getElementById('infosAttaque').innerHTML = "";
        let phraseAttaque = document.createElement("p"); 
        phraseAttaque.textContent = this.nom + " attaque.";
        document.getElementById("infosAttaque").appendChild(phraseAttaque)
        return true;
    }
    descriptionJoueur(){
        // Mise à jour des informations du joueurs
        $(this.idDescription).html( `NOM SOLDAT GRADE : ${this.nom} <br>
        \nPOINTS DE VIE : ${this.sante} <br> 
        \nARME EQUIPEE : ${this.armeEquipee.nom} <br>
        \nDEGAT ARME: ${this.armeEquipee.degat} <br>` 
        )}
}

