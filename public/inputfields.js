//Kategória válszató    
const categorySelector = document.createElement('select');
categorySelector.id = 'sel_category'

//Kategória elemek
//TODO: adatbázisban tárolni és onnan visszakérni
const option = document.createElement("option");
option.value = 'new_infected';
option.text = 'Új fertőzöttek száma';
categorySelector.add(option);
const option2 = document.createElement("option");
option2.value = "new_test";
option2.text = "Új tesztek száma";
categorySelector.add(option2);
const option3 = document.createElement("option");
option3.value = "apple";
option3.text = "Az idő fogságában";
categorySelector.add(option3);


document.getElementById('selector_fields').appendChild(categorySelector);