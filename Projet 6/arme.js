export class Arme {
    constructor(nom, degat){
        this.nom = nom;
        this.degat = degat;
    }
}
export const poingAmericain = new Arme ("Poing-americain", 10);
export const famas = new Arme ("Famas", 20);
export const machette = new Arme ("Machette", 30 );
export const machineGun = new Arme ("MachineGun", 40);
export const lanceRoquette = new Arme ("LanceRoquette", 50);
export const armes = {
    "Poing-americain" : poingAmericain,
    "famas" : famas,  
    "machette" : machette,
    "machineGun" : machineGun,
    "lanceRoquette" : lanceRoquette
};

