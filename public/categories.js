// Get the modal
const modal = document.getElementById("myModal");
const modalHeader = document.getElementsByClassName('modal-header')[0];
const modalBody = document.getElementsByClassName('modal-body')[0];

let selectedCategory;
getCategories();


async function getCategories() {
    html = `<div id="cards_container" class="row">`;
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
                            <button id="btn_end-${item._id}" data-cat_type="${item.type}" data-cat_name="${item.category}" class="btn btn-outline-success">Eddigi tippek</button>
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

function modalNewGuess() {
    modalHeader.innerHTML = `<h2>${selectedCategory.name}</h2>`;
    modalBody.innerHTML = `<label for="txt_name">Név: </label><input type="text" id="txt_name">
                           <label for="txt_guess_value">Tipp: </label><input type="number" id="txt_guess_value">`;
}

document.getElementById('btn_submit').addEventListener('click', () => {
    const txtName = document.getElementById('txt_name').value;
    const guessValue = document.getElementById('txt_guess_value').value;
    sendData(selectedCategory, txtName, guessValue);
});

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





function modalListGuesses() {
    modalHeader.innerHTML = `<h2>${selectedCategory.name}<input type="date" id="datePicker" value="2020-10-12"></h2>`;
    modalBody.innerHTML = `<label for="txt_name">Név: </label><input type="text" id="txt_name">
                           <label for="txt_guess_value">Tipp: </label><input type="number" id="txt_guess_value">`;
    getData();
};

async function getData() {

    //const response = await fetch(`/api/${selectedDate.value},${selectedCategory.id}`);
    const response = await fetch(`/api/2020-10-12,${selectedCategory.id}`);
    const data = await response.json();
    console.log(data);
    //drawTable(data);
}














// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}