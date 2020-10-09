console.log('client js');

const btn_submit = document.getElementById('btn_submit');
const sel_category = document.getElementById('sel_category');
const guess_value = document.getElementById('txt_guess_value');

sel_category.addEventListener('change', () => {
    console.log('change');
    let selectedCategory = sel_category.value;
    if (selectedCategory == 'Xzbgsivz49tu7wyh') {
        guess_value.setAttribute('type', 'time');
    } else {
        guess_value.setAttribute('type', 'number');
    }
});

btn_submit.addEventListener('click', () => {
    console.log('click');
    if (sel_category.value != 0) {
        sendData();
    } else {
        alert('Válassz kategóriát!');
    }
});

async function sendData() {
    const guess = {
        category: {
            id: sel_category.value,
            name: sel_category[sel_category.selectedIndex].innerText
        },
        name: document.getElementById('txt_name').value,
        guess_value: guess_value.value
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