// import { data } from "./data.js";
import { icon_categorie } from "./data.js";
import { color_priorite } from "./data.js"

let next_id = JSON.parse(localStorage.getItem("id")) || 1;
let remember_id = null;
let deleted_id = null;

let data = JSON.parse(localStorage.getItem("data")) || [];

const input_titre = document.querySelector("#titre");
const input_categorie = document.querySelector("#categorie");
const input_priorite = document.querySelector("#priorite");
const input_description = document.querySelector("#description");
const titre_erreur = document.querySelector(".erreur_titre");
const description_erreur = document.querySelector(".erreur_description");

const delete_form = document.querySelector(".delete_form");
let confirmeButton = document.querySelector(".confirmer");
let AnnulerButton = document.querySelector(".annuler");

const div_list = document.querySelector(".list");
const tab_list = document.querySelector(".tableau");
const t_body = document.querySelector(".table_body");

const buttonAjouter = document.querySelector("#add");
const buttonModifier = document.querySelector("#edit");

const card = document.querySelector("#card");
const table = document.querySelector("#tab");

table.addEventListener("click", (e) => {
    e.preventDefault();

    card.classList.remove("selected");
    card.classList.add("not-selected");

    table.classList.remove("not-selected");
    table.classList.add("selected");

    div_list.classList.add("hidden");
    tab_list.classList.remove("hidden");
});

card.addEventListener("click", (e) => {
    e.preventDefault();

    table.classList.remove("selected");
    table.classList.add("not-selected");

    card.classList.remove("not-selected");
    card.classList.add("selected");

    div_list.classList.remove("hidden");
    tab_list.classList.add("hidden");
});



function getIcon(_categorie) {
    return icon_categorie.find((icon) => icon.nom === _categorie);
}

function getPriorite(_priorite) {
    return color_priorite.find((color) => color.nom === _priorite);
}

function CalculerDemandes() {
    let counter = document.querySelector(".nbr_demande");
    counter.textContent = `${data.length} demandes`;
}
CalculerDemandes();

function AfficherTickets(_data) {
    resetTikets();
    if (_data.length === 0) {
        const div = document.createElement("div");

        const p = document.createElement("p");
        p.textContent = "Aucune demande n'est ajoutée";
        p.classList.add("aucune-demande");

        div.append(p);
        div_list.append(div);

        return;
    }
    _data.forEach((d) => {

        const this_icon = getIcon(d.categorie);

        const _parent = document.createElement("article");

        const div_top = document.createElement("div");
        div_top.classList.add("top");

        const div_title = document.createElement("div");
        div_title.classList.add("title");

        const div_spec = document.createElement("div");
        div_spec.classList.add("spec");

        const hr = document.createElement("hr")

        const div_actions = document.createElement("div");
        div_actions.classList.add("actions")

        const span_id = document.createElement("span");
        span_id.classList.add("id");
        span_id.textContent = `HD-${d.id}`;
        const _icon = document.createElement("i");
        _icon.classList = (this_icon.icon);
        div_top.append(_icon, span_id);

        const h3 = document.createElement("h3");
        const p = document.createElement("p");
        h3.textContent = d.titre;
        p.textContent = d.description
        div_title.append(h3, p)

        const span_categorie = document.createElement("span");
        span_categorie.classList.add("catégorie");
        const span_priorité = document.createElement("span");
        span_priorité.classList.add("priorité");
        span_priorité.classList.add(d.priorite)
        span_categorie.textContent = d.categorie;
        span_priorité.textContent = d.priorite
        div_spec.append(span_categorie, span_priorité);

        const modifier = document.createElement("button");
        modifier.classList.add("modifier");
        const supprimer = document.createElement("button");
        supprimer.classList.add("supprimer")
        modifier.textContent = "✎ Modifier";
        modifier.addEventListener("click", () => {
            FillInput(d.id);
        });

        supprimer.textContent = "♜ Supprimer";
        supprimer.addEventListener("click", () => {
            ConfirmeDelete(d.id);
        })

        div_actions.append(modifier, supprimer);

        _parent.append(div_top, div_title, div_spec, hr, div_actions);
        div_list.append(_parent);
    })


}
AfficherTickets(data);
buttonModifier.addEventListener("click", (e) => {
    e.preventDefault();
    ModifierDemandes(remember_id);
});

function AfficherTableau(_data) {
    resetTable();
    if (_data.length === 0) {
        const tr = document.createElement("tr");

        const td = document.createElement("td");
        td.colSpan = 6;
        td.textContent = "Aucune demande n'est ajoutée";
        td.classList.add("aucune-demande");

        tr.append(td);
        t_body.append(tr);

        return;
    }
    _data.forEach((d) => {

        const this_icon = getIcon(d.categorie);

        const tr = document.createElement("tr");

        const input_td = document.createElement("td");
        const checkbox = document.createElement("input");
        checkbox.type = 'checkbox';
        input_td.append(checkbox);

        const id_td = document.createElement("td");
        id_td.classList.add("id");
        id_td.textContent = `HD-00${d.id}`;

        const demande_td = document.createElement("td");
        const div_td = document.createElement("div");
        div_td.classList.add("demande");
        const div_icon = document.createElement("i");
        div_icon.classList = this_icon.icon;
        const sec_div = document.createElement("div");
        const h3 = document.createElement("h3");
        h3.textContent = d.titre;
        const p = document.createElement("p");
        p.textContent = d.description;
        sec_div.append(h3, p);
        div_td.append(div_icon, sec_div);
        demande_td.append(div_td);

        const categorie_td = document.createElement("td");
        const span1 = document.createElement("span");
        span1.classList = `badge ${d.categorie}`;
        span1.textContent = d.categorie;
        categorie_td.append(span1);

        const priorite_td = document.createElement("td");
        const span2 = document.createElement("span");
        span2.classList = `badge ${d.priorite}`;
        span2.textContent = d.priorite
        priorite_td.append(span2);

        const actions_td = document.createElement("td");
        actions_td.classList.add("actions-cell");
        const btn_1 = document.createElement("button");
        btn_1.classList = "modifier";
        btn_1.title = "Modifier";
        btn_1.textContent = "✎";
        btn_1.addEventListener("click", () => {
            FillInput(d.id);
            console.log("modifier tableau");

        });
        const btn_2 = document.createElement("button");
        btn_2.classList = "supprimer";
        btn_2.title = "Supprimer";
        btn_2.textContent = "♜";
        btn_2.addEventListener("click", () => {
            ConfirmeDelete(d.id);
            console.log("supprimer tableau");

        });
        actions_td.append(btn_1, btn_2);

        tr.append(input_td, id_td, demande_td, categorie_td, priorite_td, actions_td);
        t_body.append(tr);
    })
}
AfficherTableau(data);



function resetInput() {
    input_titre.value = "";
    input_description.value = "";
    buttonAjouter.textContent = "+ Ajouter la demande";
}

function resetTikets() {
    div_list.innerHTML = "";
}

function resetTable() {
    t_body.innerHTML = "";
}

function AjouterDemande() {
    let isValid = true;

    if (input_titre.value === "") {
        titre_erreur.classList.remove("hidden");
        isValid = false;
    }
    else {
        titre_erreur.classList.add("hidden");
    }
    if (input_description.value === "") {
        description_erreur.classList.remove("hidden");
        isValid = false;
    }
    else {
        description_erreur.classList.add("hidden");
    }

    if (isValid) {
        const __titre = input_titre.value;
        const __description = input_description.value;
        const __categorie = input_categorie.value;
        const __priorite = input_priorite.value;
        next_id = JSON.parse(localStorage.getItem("id")) || 1;
        const objet = {
            id: next_id,
            titre: __titre,
            categorie: __categorie,
            priorite: __priorite,
            description: __description
        }
        next_id++;
        localStorage.setItem("id", JSON.stringify(next_id));
        data = JSON.parse(localStorage.getItem("data")) || [];
        data.push(objet);
        localStorage.setItem("data", JSON.stringify(data))
        resetInput();
        AfficherTableau(data);
        AfficherTickets(data);
        CalculerDemandes();
    }

}

buttonAjouter.addEventListener("click", (e) => {
    e.preventDefault();
    AjouterDemande();
});

function ModifierDemandes(modified_id) {
    let isValid = true;

    if (input_titre.value === "") {
        titre_erreur.classList.remove("hidden");
        isValid = false;
    }
    else {
        titre_erreur.classList.add("hidden");
    }
    if (input_description.value === "") {
        description_erreur.classList.remove("hidden");
        isValid = false;
    }
    else {
        description_erreur.classList.add("hidden");
    }

    if (isValid) {
        const new_titre = input_titre.value;
        const new_description = input_description.value;
        const new_categorie = input_categorie.value;
        const new_priorite = input_priorite.value;
        const objet = {
            id: modified_id,
            titre: new_titre,
            categorie: new_categorie,
            priorite: new_priorite,
            description: new_description
        }
        let modified = data.findIndex((d) => d.id === modified_id);
        data = JSON.parse(localStorage.getItem("data")) || [];
        data[modified] = objet;
        localStorage.setItem("data", JSON.stringify(data))
        resetInput();
        AfficherTableau(data);
        AfficherTickets(data);
        CalculerDemandes();
        buttonAjouter.classList.remove("hidden");
        buttonModifier.classList.add("hidden");
    }
}



function FillInput(modified_id) {
    remember_id = modified_id;
    const demande = data.find((d) => d.id === modified_id);

    input_titre.value = demande.titre;
    input_description.value = demande.description;
    input_categorie.value = demande.categorie;
    input_priorite.value = demande.priorite;

    buttonAjouter.classList.add("hidden");
    buttonModifier.classList.remove("hidden");

}

function ConfirmeDelete(id) {
    deleted_id = id;
    delete_form.classList.remove("hidden");
}

confirmeButton.addEventListener("click", (e) => {
    e.preventDefault();
    data = JSON.parse(localStorage.getItem("data")) || [];
    const DeleteObjet = data.find((d) => d.id === deleted_id);
    data.splice(data.indexOf(DeleteObjet), 1);
    localStorage.setItem("data", JSON.stringify(data))
    AfficherTableau(data);
    AfficherTickets(data);
    CalculerDemandes();
    delete_form.classList.add("hidden");
})

AnnulerButton.addEventListener("click", (e) => {
    e.preventDefault();
    delete_form.classList.add("hidden");
})

const input_search = document.querySelector("#search");
function Search() {
    data = JSON.parse(localStorage.getItem("data")) || [];
    let searchData = data.filter((d) => d.titre.toLowerCase().includes(input_search.value.toLowerCase()));
    AfficherTickets(searchData);
    AfficherTableau(searchData);
}

input_search.addEventListener("input", () => {
    Search();
})

const selectFilter = document.querySelector("#filter");
selectFilter.addEventListener("change", () => {
    data = JSON.parse(localStorage.getItem("data")) || [];
    if (selectFilter.value == "Afficher Tous") {
        console.log(data);
        AfficherTickets(data);
        AfficherTableau(data);
    }
    else{
    let filterData = data.filter((d) => d.categorie.toLowerCase() == selectFilter.value.toLowerCase());
    AfficherTickets(filterData);
    AfficherTableau(filterData);
    }
})