

//const et vars
const taches_liste_parent = document.getElementById("taches_liste_parent");
const liste_enfant = document.createElement("li");
liste_enfant.className = "list-group-item";
//Details
const details_list_parent = document.getElementById("details_liste_parent");
const liste_enfant_details = document.createElement("li");
liste_enfant_details.className = "list-group-item";
//Ajouter
const btn_ajouter_tache = document.getElementById("btn-ajouter-tache");
const form_ajouter = document.getElementById("form-ajouter")
//Editer
const form_edit = document.getElementById("form-editer");
form_edit.style.display = "none";
const btn_editer = document.getElementById("btn-editer-tache");


//DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    afficher_taches();
});

//Fonctions qui consoment l'API
const afficher_taches = () => {
    taches_liste_parent.style.display = "block";
    fetch("http://localhost:3000/taches/")
        .then(response => {
            return response.json();
        })
        .then(Taches => {
            const get_taches = Taches.map(alias => 
                `
                <div class="bg-white border rounded p-3 mt-3">
                    <div>ID : ${alias.id}</div>
                    <div>Tache : ${alias.tache}</div>
                    <div>Statuts : ${alias.completer ? "OUI" : "NON"}</div>
                    <span class="">
                        <button onclick="supprimer_tache(${alias.id})" class="btn btn-danger mt-3" id="${alias.id}" type="button">Supprimer</button>
                        <button onclick="editer_tache(${alias.id})" class="btn btn-info mt-3" id="${alias.id}" type="button">Editer</button>
                        <button onclick="details_tache(${alias.id})" class="btn btn-success mt-3" id="${alias.id}" type="button">Détails</button>
                    </span>
                </div>
                `
            );
            liste_enfant.innerHTML = get_taches.join(" ");
            taches_liste_parent.append(liste_enfant);
        });
}

//METHODES DU CRUD


//SUPPRIMER
const supprimer_tache = (id) =>{
    confirm("Supprimer cette tache !" + id)
    fetch(`http://localhost:3000/taches/${id}`, {method: "DELETE"})
        .then(response => response.json)
        .then(() => window.location.reload())
        .catch(error => console.error("Erreur lors de la supression de la tache !" + error))
}

//DETAILS
const details_tache = (id) => {
    taches_liste_parent.style.display = "none";
    fetch(`http://localhost:3000/taches/${id}`)
        .then(response => {
            return response.json();
        })
        .then(une_tache => {
            const tache = 
            `
            <div class="bg-white border rounded p-3 mt-3">
                <div>ID : ${une_tache.id}</div>
                <div>Tache : ${une_tache.tache}</div>
                <div>Statuts : ${une_tache.completer ? "OUI" : "NON"}</div>
                <span class="">
                    <button onclick="retour_accueil()" class="btn btn-danger mt-3" type="button">RETOUR</button>
                </span>
            </div>
            `

            liste_enfant_details.innerHTML = tache;
            details_liste_parent.append(liste_enfant_details);
        });
}

//AJOUTER
btn_ajouter_tache.addEventListener("click", () => {
    //Champ du formulaire
    let input_tache = document.getElementById("input-tache").value;
    let completer_tache = document.getElementById("completer-tache").checked;
    
    if(input_tache != ""){
        
    //Nouvel objet a passer a l'API
    let nouvelle_tache = {
        tache: input_tache,
        completer: completer_tache
    };
    console.log(nouvelle_tache.tache);

    fetch("http://localhost:3000/taches", {
        method: "POST",
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(nouvelle_tache)
    })
    .then(response =>  response.json())
    .then(afficher_taches())
    .catch(error => console.error("Erreur lors de l'ajout de la tache" + error));


    document.getElementById("input-tache").value = "";
    }else{
        alert("Merci de remplir tous les champ !")
    }
});

//EDITER
const editer_tache = (id) => {
    form_ajouter.style.display = "none";
    form_edit.style.display = "block";
    taches_liste_parent.style.display = "none";
    details_tache(id);
    //Click
    btn_editer.addEventListener("click", () => {
         //Champ du formulaire
    let input_edit_tache = document.getElementById("input-edit-tache").value;
    let completer_edit_tache = document.getElementById("completer-edit-tache").checked;

    if(input_edit_tache != ""){
        //Nouvel objet a passer a l'API
    let maj_tache = {
        tache: input_edit_tache,
        completer: completer_edit_tache
    };
    

    fetch(`http://localhost:3000/taches/${id}`, {
        method: "PUT",
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(maj_tache)
    })
    .then(response =>  response.json())
    .then(afficher_taches())
    .catch(error => console.error("Erreur lors de l'ajout de la tache" + error));


    document.getElementById("input-edit-tache").value = "";
    }else{
        alert("Merci de remplir tous les champs !");
    }
    });
}

//BACK NAV
const retour_accueil = () => {
    window.location.reload()
}