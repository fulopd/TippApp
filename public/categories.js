// Get the modal
const modal = document.getElementById("myModal");
const modalHeader = document.getElementsByClassName('modal-header')[0];
const modalBody = document.getElementsByClassName('modal-body')[0];
const modalFooter = document.getElementsByClassName('modal-footer')[0];

let selectedCategory;
getCategories();


async function getCategories() {

    const response = await fetch('/getcategories');
    const data = await response.json();
    let categoriesArray = [];
    for (const item of data) {
        const categoryStat = await getCategoryStatistic(item._id);
        categoriesArray.push({
            weight: categoryStat.length,
            content: `<div class="col-sm-4">
                            <div class="card border-success">
                              <div class="card-header">${item.category}</div>
                                  <div class="card-body">
                                      <p class="card-text">Összes tipp: ${categoryStat.length}</br>
                                      Utolsó tipp: ${categoryStat.lastGuess}</p>
                                      <button id="btn_new-${item._id}" data-cat_type="${item.type}" data-cat_name="${item.category}" class="btn btn-outline-success">Új tipp</button>
                                      <button id="btn_list-${item._id}" data-cat_type="${item.type}" data-cat_name="${item.category}" class="btn btn-outline-success">Eddigi tippek</button>
                                      <button id="btn_end-${item._id}" data-cat_type="${item.type}" data-cat_name="${item.category}" class="btn btn-outline-warning">Új eredmény</button>
                                  </div>
                              </div>
                          </div>`
        });
    }
    categoriesArray.sort(function(a, b) {
        return b.weight - a.weight;
    });
    let html = '';
    categoriesArray.forEach(item => html += item.content);

    //Új kategória gomb
    html += `<div class="col-sm-4">
                <div class="card border-success">
                <div class="card-header">Új kategóri létrehozása</div>
                    <div class="card-body text-center">
                        <p><button id="btn_new_category" class="btn btn-outline-success">+</button></p>
                    </div>
                </div>
            </div>`;
    document.getElementById('categories').innerHTML = html;
}

async function getCategoryStatistic(catId) {
    const response = await fetch(`/statistics-category/${catId}`);
    const data = await response.json();

    if (data.length > 0) {
        return {
            length: data.length,
            lastGuess: data[0].timestamp
        }
    }
    return {
        length: data.length,
        lastGuess: '-'
    }
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
                modalAddResult();
                break;
            default:
                console.log('Nincs ilyen...')
        }
        modal.style.display = "block";
    } else if (e.target.id === 'btn_new_category') {
        console.log('Új kategória felvétele!')
        modalNewCategory();
        modal.style.display = "block";
    }
});

//Új tipp leadása
function modalNewGuess() {
    modalHeader.innerHTML = `<h2>${selectedCategory.name}</h2>`;
    modalBody.innerHTML = `<input type="date" id="datePicker">
                           <label for="txt_name">Név: </label><input type="text" id="txt_name">
                           <label for="txt_guess_value">Tipp: </label><input type="${selectedCategory.type}" id="txt_guess_value">`;
    modalFooter.innerHTML = `<button class="btn btn-light" type="submit" id="btn_submit">Küldés</button>`;

    let datePicker = document.getElementById('datePicker');
    let dateObj = new Date();
    datePicker.value = dateObj.toISOString().substr(0, 10);
    document.getElementById('btn_submit').addEventListener('click', () => {
        const txtName = document.getElementById('txt_name').value;
        const guessValue = document.getElementById('txt_guess_value').value;
        sendData(selectedCategory, txtName, guessValue, datePicker.value);
        modal.style.display = "none";
    });
}
async function sendData(selectedCategory, txtName, guessValue, date) {
    const guess = {
        category: selectedCategory,
        name: txtName,
        guess_value: guessValue,
        timestamp: date
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

    modalHeader.innerHTML = `<h2>${selectedCategory.name} <input type="date" id="datePicker"></h2><span class="close">&times;</span>`;
    modalFooter.innerHTML = '';
    let datePicker = document.getElementById('datePicker');
    let dateObj = new Date();
    datePicker.value = dateObj.toISOString().substr(0, 10);
    getData(datePicker.value);

    datePicker.addEventListener('change', () => { getData(datePicker.value); });
    document.getElementsByClassName('close')[0].addEventListener('click', () => { modal.style.display = "none"; });

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




//Eredmény rögzítése
function modalAddResult() {
    //Header
    modalHeader.innerHTML = `<h2>${selectedCategory.name}</h2>`;
    //Body

    modalBody.innerHTML = `<input type="date" id="datePicker">
                           <label for="txt_guess_value">Eredmény: </label><input type="${selectedCategory.type}" id="txt_guess_value"></input>
                           <canvas id="myCanvas"></canvas>`;
    let ctx = document.getElementById('myCanvas').getContext('2d');;
    createChart(ctx);
    let datePicker = document.getElementById('datePicker');
    let dateObj = new Date();
    datePicker.value = dateObj.toISOString().substr(0, 10);
    //Footer
    modalFooter.innerHTML = `<button class="btn btn-light" type="submit" id="btn_submit">Küldés</button>`;
    document.getElementById('btn_submit').addEventListener('click', () => {
        const guessValue = document.getElementById('txt_guess_value').value;
        sendResult(datePicker.value, guessValue);
        //modal.style.display = "none";
        modalAddResult();
    });
}

async function sendResult(date, result) {
    const guessResult = {
        category: selectedCategory.id,
        date: date,
        value: result
    };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(guessResult)
    };
    const response = await fetch('/guessresult', options);
    const res_data = await response.json();
    console.log(res_data);
}


//Új kategória felvétele
function modalNewCategory() {
    modalHeader.innerHTML = `<h2>Új kategória:</h2>`;
    modalBody.innerHTML = ` <label for="txt_new_category">Új kategória: </label>
                            <input type="text" id="txt_new_category">
                            <select id="sel_type">
                                <option value="number">Szám</option>
                                <option value="time">Idő</option>
                                <option value="date">Dátum</option>
                            </select>`;
    modalFooter.innerHTML = `<button class="btn btn-light" type="submit" id="btn_submit">Küldés</button>`;

    document.getElementById('btn_submit').addEventListener('click', () => {
        const categoryName = document.getElementById('txt_new_category').value;
        const categoryType = document.getElementById('sel_type').value;
        sendNewCategory(categoryName, categoryType);
        modal.style.display = "none";
    });
}
async function sendNewCategory(categoryName, categoryType) {
    const newCategory = {
        category: categoryName,
        type: categoryType
    };
    console.log(newCategory);
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCategory)
    };
    const response = await fetch('/newcategory', options);
    const res_data = await response.json();
    console.log(res_data);
    getCategories();
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


//Grafikon
async function getResults() {
    const response = await fetch(`/results/${selectedCategory.id}`);
    const data = await response.json();
    if (data.length > 0) {
        let x = [];
        let y = [];

        data.forEach(item => {
            x.push(item.date);
            if (item.value.includes(':')) {
                let [hours, minutes] = item.value.split(':');
                let d = new Date(`1970-01-01 ${hours}:${minutes}:00`);
                y.push(d);
            } else {
                y.push(item.value);
            }


        });
        return { x, y };
    }
    return null;
}

async function createChart(ctx) {
    const res = await getResults();
    if (res != null) {
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: res.x,
                datasets: [{
                    label: selectedCategory.name,
                    data: res.y,
                    fill: false,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            callback: function(value, index, values) {
                                if (selectedCategory.type === 'time') {
                                    let date = new Date(value);
                                    let hours = date.getHours();
                                    let min = date.getUTCMinutes();
                                    return hours + ':' + min;
                                } else {
                                    return value;
                                }
                            }
                        }
                    }]
                }
            }
        });
    }
}