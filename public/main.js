console.log('client js');

const btn_submit = document.getElementById('btn_submit');

btn_submit.addEventListener('click', ()=>{
    console.log('click');
    sendData();
});

async function sendData(){
    const guess = {
        name: document.getElementById('txt_name').value,
        guess_value: document.getElementById('txt_guess_value').value
    }
    console.log(guess);
    options = {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(guess)
    };
    const response = await fetch('/', options);
    const data = await response.json();
    console.log(data);
}