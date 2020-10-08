console.log('guessresult');
let selectedDate = document.getElementById('datePicker');
let dateObj = new Date();
selectedDate.value = dateObj.toISOString().substr(0, 10);

document.getElementById('btn_sendDate').addEventListener('click', () => {
    sendData();
});

async function sendData() {
    const guessResult = {
        category: document.getElementById('sel_category').value,
        date: selectedDate.value,
        value: document.getElementById('txt_result').value
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