console.log('Statistics');
const statRoot = document.createElement('div');
document.body.appendChild(statRoot);
const sel_name = document.getElementById('sel_name');
getAllName();

document.getElementById('btn_submit').addEventListener('click', () => {
    getData(sel_name.value)
});

async function getAllName() {
    const response = await fetch(`/getnames`);
    const data = await response.json();
    console.log(data);

    for (const item of data) {
        let option = document.createElement('option');
        option.value = item.name;
        option.innerText = item.name;
        sel_name.add(option);
    }

}

async function getData(name) {
    const response = await fetch(`/statistics/${name}`);
    const data = await response.json();
    console.log(data);
    calculate(data);
}

function calculate(data) {
    let sum = data.length;
    let win = 0;
    let categories = [];
    //Felhasználó által használt kategóriák
    for (const item of data) {
        if (!categories.includes(item.category.name)) {
            categories.push(item.category.name);
        }
        if ('win' in item) {
            win++;
        }
    }
    //Adott kategóriában elért eredmények
    let statistics = [];
    for (const category of categories) {
        let userStat = {};
        userStat.category = category;
        userStat.count = 0;
        userStat.win = 0;
        for (const item of data) {
            if (category == item.category.name) {
                userStat.count++;
                if ('win' in item) {
                    userStat.win++;
                }
            }
        }
        statistics.push(userStat);
    }
    console.log(statistics);
    console.log(`Összes / nyert: ${sum} / ${win}`);

    //kiíratár

    let table = `<table class="table table-striped table-hover">
                    <tr>
                        <th>Kategória</th>
                        <th>Összesen</th>
                        <th>Nyert</th>
                    </tr>`;
    for (const item of statistics) {
        table += `<tr>
                        <td>${item.category}</td>
                        <td>${item.count}</td>
                        <td>${item.win}</td>
                    </tr>`;
    }
    table += `<tr>
                <td>Összesen</td>
                <td>${sum}</td>
                <td>${win}</td>
            </tr>
        </table>`;

    statRoot.innerHTML = table;

};