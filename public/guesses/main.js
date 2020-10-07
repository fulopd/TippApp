console.log('guesses');
let selectedDate = document.getElementById('datePicker');
let dateObj = new Date();
selectedDate.value = dateObj.toISOString().substr(0, 10);
getData();

document.getElementById('btn_sendDate').addEventListener('click', () => {
    getData();
});


async function getData() {
    const response = await fetch(`/api/${selectedDate.value}`);
    const data = await response.json();
    console.table(data);
    drawTable(data);
}

function drawTable(data) {

    let htmlTable = `<table class="table table-striped table-hover">
                        <thead class="thead-light">
                            <tr>
                                <th>Dátum</th>
                                <th>Név</th>
                                <th>Tipp</th>
                            </tr>
                        </thead>`;
    for (const item of data) {
        htmlTable += `<tr>
                        <td>${item.timestamp}</td>
                        <td>${item.name}</td>
                        <td>${item.guess_value}</td>
                      </tr>`;
    };
    htmlTable += `</table>`;
    document.getElementById('guesses_table').innerHTML = htmlTable;
}