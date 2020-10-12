// Get the modal
const modal = document.getElementById("myModal");
const modalHeader = document.getElementsByClassName('modal-header')[0];
const modalBody = document.getElementsByClassName('modal-body')[0];
const modalFooter = document.getElementsByClassName('modal-footer')[0];

let selectedCategory;
getCategories();


async function getCategories() {
    html = `<div class="row">`;
    const response = await fetch('/getcategories');
    const data = await response.json();
    console.log(data);
    for (const item of data) {
        html += `<div class="col-sm-4">
                    <div class="card border-success">
                    <div class="card-header">${item.category}</div>
                        <div class="card-body">
                            <p class="card-text">${item._id} , ${item.type}</p>
                            <button id="btn_new-${item._id}" data-cat_type="${item.type}" data-cat_name="${item.category}" class="btn btn-outline-success">Új tipp</button>
                            <button id="btn_list-${item._id}" data-cat_type="${item.type}" data-cat_name="${item.category}" class="btn btn-outline-success">Eddigi tippek</button>
                            <button id="btn_end-${item._id}" data-cat_type="${item.type}" data-cat_name="${item.category}" class="btn btn-outline-success">Eredmény</button>
                        </div>
                    </div>
                </div>`;
    }
    html += `</div>`;
    document.getElementById('categories').innerHTML = html;
}

document.getElementById('categories').addEventListener('click', (e) => {
    if (e.target.id.includes('-')) {
        let idSplit = e.target.id.split('-');

        selectedCategory = {
            id: idSplit[1],
            name: e.target.dataset.cat_name,
            type: e.target.dataset.cat_type
        };
        switch (idSplit[0]) {
            case 'btn_new':
                console.log('Új tipp felvétele ' + selectedCategory.name)
                modalNewGuess();
                break;
            case 'btn_list':
                console.log('Eddig rögzíett tippek: ' + selectedCategory.name)
                modalListGuesses();
                break;
            case 'btn_end':
                console.log('Végeredmény rögzítése: ' + selectedCategory.name)
                break;
            default:
                console.log('Nincs ilyen...')
        }
        modal.style.display = "block";
    }
});

//Új tipp leadása
function modalNewGuess() {
    modalHeader.innerHTML = `<h2>${selectedCategory.name}</h2>`;
    modalBody.innerHTML = `<label for="txt_name">Név: </label><input type="text" id="txt_name">
                           <label for="txt_guess_value">Tipp: </label><input type="${selectedCategory.type}" id="txt_guess_value">`;
    modalFooter.innerHTML = `<button class="btn btn-light" type="submit" id="btn_submit">Küldés</button>`;
    
    document.getElementById('btn_submit').addEventListener('click', () => {
        const txtName = document.getElementById('txt_name').value;
        const guessValue = document.getElementById('txt_guess_value').value;
        sendData(selectedCategory, txtName, guessValue);
    });
}
async function sendData(selectedCategory, txtName, guessValue) {
    const guess = {
        category: selectedCategory,
        name: txtName,
        guess_value: guessValue
    }
    console.log(guess);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(guess)
    };
    const response = await fetch('/add', options);
    const data = await response.json();
    console.log(data);
}


//Kategória elemeinek kilistázása
function modalListGuesses() {

    modalHeader.innerHTML = `<h2>${selectedCategory.name}<input type="date" id="datePicker"></h2>`;
    modalFooter.innerHTML = '';
    let datePicker = document.getElementById('datePicker');
    let dateObj = new Date();
    datePicker.value = dateObj.toISOString().substr(0, 10);
    getData(datePicker.value);

    datePicker.addEventListener('change', () => {
        getData(datePicker.value);
    });

};
async function getData(date) {
    const response = await fetch(`/api/${date},${selectedCategory.id}`);
    const data = await response.json();
    console.log(data);
    drawTable(data);
}
function drawTable(data) {
    let result = 0;
    if (data.res[0]) {
        result = data.res[0].value;
    }
    let htmlTable = `<table class="table table-striped table-hover">
                        <thead class="thead-light">
                            <tr>
                                <th>Kategória</th>
                                <th>Dátum</th>
                                <th>Név</th>
                                <th>Tipp</th>
                                <th>Eltérés (${result})</th>
                            </tr>
                        </thead>`;
    for (const item of data.guesses) {
        htmlTable += `<tr>
                        <td>${item.category.name}</td>
                        <td>${item.timestamp}</td>
                        <td>${item.name}</td>
                        <td>${item.guess_value}</td>
                        <td>${item.diff}</td>
                      </tr>`;
    };
    htmlTable += `</table>`;
    modalBody.innerHTML = htmlTable;
}









// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}