console.log('guesses');
let selectedDate = document.getElementById('datePicker');
let dateObj = new Date();
selectedDate.value = dateObj.toISOString().substr(0, 10);
let sel_category = document.getElementById('sel_category');


document.getElementById('btn_sendDate').addEventListener('click', () => {
    if (sel_category.value != 0) {
        getData();
    } else {
        alert('Válassz kategóriát!');
    }
});


async function getData() {
    const category = sel_category.value;
    const response = await fetch(`/api/${selectedDate.value},${category}`);
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

    document.getElementById('guesses_table').innerHTML = htmlTable;
}