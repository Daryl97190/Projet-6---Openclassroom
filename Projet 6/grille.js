import {armes, Arme} from "./arme.js"; 
import {Joueur} from "./joueurs.js"; 
import { Case } from "./case.js";

export class Grille {

  constructor () {
    this.joueurs = [];
    this.joueurCourant;
    this.coordonnesSauvegardee = [];
    this.compteur = 0;
    this.cases = new Array (10)
    for (let x = 0; x < 10; x++) {
      this.cases[x] = new Array (10)
      for (let y = 0; y < 10; y++) {
        this.cases[x][y] = new Case(false, null) // génération de la grille sans les armes et les obstacle
      };
    };
    $.getJSON("data.json", (json) => {
      this.obstacles = json.obstacles; 
      this.genererGrille();
      this.genererObstacle();
      this.genererArme();
      this.genererJoueur();
      this.ecouterLesTouches();
      this.echangerLesArmes();
      this.terminerMonTour();
      this.combat();
      this.finDeJeu();
  })
  }
  genererGrille() { // Cette méthode me permet de créer une 10*10 dans mon code HTML 
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        $("#grilledujeu").append(`<div class="case" id="${x}-${y}"></div>`)
      }
    }
  }
  genererObstacle() {
    for (let i = 0; i < this.obstacles; i++) { 
      const coordonneesCaseObstacle = this.coorAleatoire();
      let murX = coordonneesCaseObstacle[0];
      let murY = coordonneesCaseObstacle[1];
      $(`#${murX}-${murY}`).addClass("obstacle");
      this.cases[murY][murX].obstacle = true; // Permet l'impossibilité de franchire un obstacle pour les joueurs.
    }
  }
  genererArme() {
    for (let arme in armes) {
      if (arme == "Poing-americain") { 
        continue // permet de continuer la boucle lorsque le navigateur trouve le point americain 
      }
      arme = armes[arme]
      let coordonneesArme = this.coorAleatoire();
      this.cases[coordonneesArme[0]][coordonneesArme[1]].arme = arme
      $(`#${coordonneesArme[0]}-${coordonneesArme[1]}`).addClass(arme.nom)
    }
  }
  genererJoueur() {
    const coordonneesJoueur1 = this.coorAleatoire();
    let coordonneesJoueur2 = this.coorAleatoire()
    while (this.coordonnesCoteAcote(coordonneesJoueur1,coordonneesJoueur2)) { // éviter que les deux joueurs se génère cote a cote
      coordonneesJoueur2 = this.coorAleatoire()
    }
    const alexMason = new Joueur ("Alex Mason", 100, new Arme ("Poing-americain", 10), coordonneesJoueur1, "joueuralexmason","#descriptionAlexMason");
    const solidSnake = new Joueur ("Solid Snake", 100, new Arme ("Poing-americain", 10), coordonneesJoueur2, "joueursolidsnake", "#descriptionSolidSnake" );
    this.joueurs = [alexMason,solidSnake]
    this.joueurCourant = this.joueurs[(Math.floor(Math.random() * this.joueurs.length))] // permet de faire commencer un joueur de maniere aléatoire
    swal(this.joueurCourant.nom + " commence la partie")
    $(`#${coordonneesJoueur1[0]}-${coordonneesJoueur1[1]}`).addClass("joueuralexmason")
    $(`#${coordonneesJoueur2[0]}-${coordonneesJoueur2[1]}`).addClass("joueursolidsnake")
  }
  ecouterLesTouches() {
    document.onkeydown = clavier => { // Si une des flèches est enfoncée, le joueur se déplace //
      if (clavier.key === "ArrowUp" || clavier.key === "ArrowDown" || clavier.key === "ArrowLeft" || clavier.key === "ArrowRight" ) {
        this.deplacementDuJoueur(clavier.key)
      }
    } 
  }
  echangerLesArmes() {
    const x = this.joueurCourant.coordonnees[0]
    const y = this.joueurCourant.coordonnees[1]
    const caseCourante = this.cases[x][y]
    if (caseCourante.arme != null) {
      let armeTemporaire = caseCourante.arme 
      caseCourante.arme = this.joueurCourant.armeEquipee
      this.joueurCourant.armeEquipee = armeTemporaire
      $(`#${x}-${y}`).removeClass(this.joueurCourant.armeEquipee.nom)
      $(`#${x}-${y}`).addClass(caseCourante.arme.nom)
      this.joueurCourant.descriptionJoueur()
    }
  }
  terminerMonTour() {
    let boutonTerminerMonTour = $("#terminerMonTour");
    boutonTerminerMonTour.click( () => {  // la fonction fléché permet d'utiliser this sur différent objets
      this.changementDeJoueur()
      this.compteur = 0
    })
  }
  combat() {
    $("#attaque").click( () => {
      this.joueurCourant.attaque(this.trouverAutreJoueur());
      this.terminerMonTour();
      this.joueurCourant.descriptionJoueur()
      this.trouverAutreJoueur().descriptionJoueur();
      this.changementDeJoueur();
      this.finDeJeu();
      
    });
    $("#defendre").click( () => {
      this.joueurCourant.seDefend();
      this.terminerMonTour();
      this.joueurCourant.descriptionJoueur();
      this.trouverAutreJoueur().descriptionJoueur();
      this.changementDeJoueur();
      this.finDeJeu();
    });
  }
  deplacementDuJoueur(direction) {
    const positionJ = this.joueurCourant.coordonnees
    let positionJoueurX = positionJ[0];
    let positionJoueurY = positionJ[1];
    if (direction === "ArrowDown") {
      positionJoueurY ++;
    } else if (direction === "ArrowUp") {
      positionJoueurY --;
    } else if (direction === "ArrowLeft") {
      positionJoueurX --;
    } else if (direction === "ArrowRight") {
      positionJoueurX ++;
    }
    if (this.verificationDeLaCase(positionJoueurX, positionJoueurY) && this.deplacementAutoriseeMax3cases() )  {
      $(`#${positionJ[0]}-${positionJ[1]}`).removeClass(this.joueurCourant.css)
      $(`#${positionJoueurX}-${positionJoueurY}`).addClass(this.joueurCourant.css)
      this.joueurCourant.coordonnees[0] = positionJoueurX;
      this.joueurCourant.coordonnees[1] = positionJoueurY;
      this.echangerLesArmes();
      this.passageModeCombat();
    }
  }
  changementDeJoueur(){  // Méthode pour le changement de joueur //
    this.joueurCourant = this.trouverAutreJoueur()
  }
  passageModeCombat() { // supprime la méthode déplacementDuJoueur(). Les joueurs ne peuvent plus se déplacer 
    if (this.coordonnesCoteAcote(this.joueurs[0].coordonnees, this.joueurs[1].coordonnees)) {
      $("#terminerMonTour").hide(); // Le boutton terminerMonTour disparait
      delete this.deplacementDuJoueur() // Bloque le déplacement des joueurs en mode comb&t
      this.changementDeJoueur(); // Pour que le joueur adverse puissent etre le premier à attaquer
      (function() {
        swal("Soyez pret à combattre !!");
        $("#attaque").show(), $("#defendre").show(), $("#passageDeTour").hide(); // les bouttons attaque défense apparaissent 
      }());
    } 
  }
  finDeJeu() {
    if (this.joueurs[0].sante <= 0) {
      this.joueurs[0].sante = 0
      this.joueurCourant.descriptionJoueur();
      setTimeout( () => {
        alert("Bravo, le joueur " + this.joueurs[1].nom + " gagne la partie !! \n La partie est terminée");
        this.RejouerPartie()
      },100);
      
    } else if (this.joueurs[1].sante <= 0) {
      this.joueurs[1].sante = 0;
      this.joueurCourant.descriptionJoueur();
      setTimeout( () => {
        alert("Bravo, le joueur " + this.joueurs[0].nom  + " gagne la partie !! \n La partie est terminée");
        this.RejouerPartie()
      },100);
    }
  } 
  RejouerPartie() {
    if (confirm("Voulez vous refaire une partie ?") === true) {
      location.reload()
    } else {
      alert("C'est dommage !!")
    }
  }
  verificationDeLaCase(limiteX,limiteY) {
    if (limiteX >= 0 && limiteX <= 9) {
      if (limiteY >= 0 && limiteY <= 9) {
        if (!this.cases[limiteY][limiteX].obstacle) {
          return true
        } else {
          return false } 
        } else {
          return false
        }
      }
    } 
    contient(tableau, element) {
      for(let el of tableau ) {
        if (el[0] === element[0] && el[1] === element[1]) {
          return true
        }
      }
      return false
    }
    coorAleatoire() {
      let coordonnees;
      do { coordonnees = [this.nbAleatoire(10),this.nbAleatoire(10)] // stocke deux nombres aléatoires dans un tableau
      } while (this.contient(this.coordonnesSauvegardee,coordonnees));
      this.coordonnesSauvegardee.push(coordonnees); // permet de stocker une coordonne et eviter de générer la meme.
      return coordonnees
    }
    nbAleatoire(max) {
      return Math.floor(Math.random() * max) // Math.floor renvoie le plus grand entier qui est inférieur ou égal à un nombre
    } 
    coordonnesCoteAcote(coordonnees1, coordonnees2) {
      if (coordonnees1[0] === coordonnees2[0]) {
        if (coordonnees1[1] === coordonnees2[1]+1 || coordonnees1[1] === coordonnees2[1]  ||coordonnees1[1] === coordonnees2[1]-1 ) {
          return true  
        } else {
          return false
        }
      }
      if (coordonnees1[1] === coordonnees2[1] ) {
        if (coordonnees1[0] === coordonnees2[0]+1 || coordonnees1[0] === coordonnees2[0]-1 || coordonnees1[0] === coordonnees2[0] ) {
          return true  
        } else { 
          return false
        }
      }
      return false
    }
    deplacementAutoriseeMax3cases() { // Compteur de déplacement au maximum de 3 cases //
      if (this.compteur <= 2) {
        this.compteur++
        return true 
      } else {
        return false
      } 
    }
    trouverAutreJoueur() {
      const index = this.joueurs.indexOf(this.joueurCourant) // renvoie le premier indice pour lequel on trouve un élément donné dans un tableau.
      if (index === 0) {
        return this.joueurs[1]
      } else {
        return this.joueurs[0]
      
      } 
    }
  }
  
