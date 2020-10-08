console.log('guessresult');
let selectedDate = document.getElementById('datePicker');
let dateObj = new Date();
selectedDate.value = dateObj.toISOString().substr(0, 10);

const sel_category = document.getElementById('sel_category');
const res_value = document.getElementById('txt_result')

sel_category.addEventListener('change', () => {
    console.log('change');
    let selectedCategory = sel_category.value;
    if (selectedCategory == 'apple') {
        res_value.setAttribute('type','time');
    }else{
        res_value.setAttribute('type','number');
    }
});

document.getElementById('btn_sendDate').addEventListener('click', () => {
    sendData();
});

async function sendData() {
    const guessResult = {
        category: sel_category.value,
        date: selectedDate.value,
        value: res_value.value
    };
    console.log(guessResult);
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