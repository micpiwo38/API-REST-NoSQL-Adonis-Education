//Framework Express
const express = require("express");
//Insatnce du framework
const app = express();
//Port d'ecoute
const PORT = 3000;
//Gestionnaire de fichier nodejs
const fs = require('fs');

//Source des données json
let taches_json = require("./json/taches.json");

//Middleware => analyse des entetes des requetes HTTPs
app.use(express.json());
//Tous les fichiers statiques du dossier public sont accessibles
app.use(express.static("public"));

//Ficher HTML
app.get("/", (req, res) => {
    res.sendFile("public/index.html");
});

//Lister toutes les taches
app.get("/taches", (req, res) => {
    res.sendFile(__dirname + "/json/taches.json");
});

//Afficher une seule tache
app.get("/taches/:id", (req, res) => {
    //Bind de ID de url => id d'un objet json
    const id = parseInt(req.params.id);
    //fonction find js
    const une_tache = taches_json.find(une_tache => une_tache.id === id);
    //Si ID n'existe pas => throw error
    if(!une_tache){
        return res.status(404).send("Cet ID n'existe pas !");
    }else{
        res.json(une_tache);
    }
});

//Ajouter une tache
app.post("/taches", (req, res) => {
    //Recuperer les taches json object existant
    //Creer un objet taches a ajouté au tableau json
    const nouvelle_tache = {
        id: taches_json.length + 1,
        tache: req.body.tache,
        completer: req.body.completer
    };
     if(!taches_json){
        console.log("error");
        res.status(404).send("Erreur");
     }else{
        //Ajouter le nouvel objet au tableau d'objet json
        taches_json.push(nouvelle_tache);
        sauvegarder_tache(taches_json);
         //Status code 201 si ca marche
        res.status(201).json(nouvelle_tache);
     }
});

//Supprimer une tache
app.delete("/taches/:id", (req, res) => {
     //Bind de ID de url => id d'un objet json
     const id = parseInt(req.params.id);
     //fonction find js
     const une_tache = taches_json.findIndex(une_tache => une_tache.id === id);
     //Si ID n'existe pas => throw error
     if(une_tache == -1){
         return res.status(404).send("Cet ID n'existe pas !");
     }else{
         taches_json.splice(une_tache, 1);
         res.status(200).json("La tache a bien été supprimée !");
         sauvegarder_tache(taches_json);
         res.status(200).json("Le tableau de tache a bien été sauvegardé !");
     }
});

//Mettre a jour une tache
app.put("/taches/:id", (req, res) => {
    //Bind de ID de url => id d'un objet json
    const id = parseInt(req.params.id);
    //fonction find js
    const une_tache = taches_json.findIndex(une_tache => une_tache.id === id);
    //Si ID n'existe pas => throw error
    if(une_tache == -1){
        return res.status(404).send("Cet ID n'existe pas !");
    }else{
        const changement_tache = {
            id: taches_json[une_tache].id,
            tache: req.body.tache,
            completer: req.body.completer
        }
        taches_json[une_tache] = changement_tache;
        sauvegarder_tache(taches_json);
        res.status(200).json("La tache a bien été modifiée et sauvegardée !");
    }
});

//Port d'ecoute
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`)
});


//SAUVEGARDER LES CHANGEMENTS SUR CHAQUE OBJET TACHES
const sauvegarder_tache = (tableau_taches) => {
    //convertit une chaine js en json
    const tache_to_json = JSON.stringify(tableau_taches, null, 2);
    //fs => node offre une fonction pour enregister des objets dans un fichier (source, cible)
    fs.writeFileSync("./json/taches.json", tache_to_json, "utf8");
}