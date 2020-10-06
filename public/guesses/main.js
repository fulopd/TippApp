console.log('guesses');

getData();

async function getData(){
    const response = await fetch('/api');
    const data = await response.json();
    console.table(data);
}