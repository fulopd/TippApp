//Kategória válszató    
const categorySelector = document.createElement('select');
categorySelector.id = 'sel_category'

getCategories();

async function getCategories() {
    const response = await fetch('/getcategories');
    const data = await response.json();
    console.log(data);
    for (const item of data) {
        const option = document.createElement("option");
        option.value = item._id;
        option.text = item.category;
        categorySelector.add(option);
    }
}

document.getElementById('selector_fields').appendChild(categorySelector);