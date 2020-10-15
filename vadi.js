/*
let Person = function(age, name, birth) {
    this.age = age;
    this.name = name;
    this.birth = birth;
};

Person.prototype.valami = function() {
    console.log('valami');
}

let john = new Person(11, 'John', 1987);
console.log(john.prototype);
john.valami();

let asd = {
    name: 'valaki',
    age: 33,
    birth: 1987,
    szamol: function() {
        this.eredmeny = this.age + this.birth
    }

}
asd.szamol();
console.log(asd.eredmeny);


//IIFE - immediately invoked function expression ("iffy")
(function() {
    console.log('ez a belseje');
})();
*/

// const arr = [1990, 1987, 2001, 2010];

// var ages5 = arr.map(function(elements, index, array) {
//         return 2020 - elements;
//     })
//     //console.log(ages5);

// // const ages6 = arr.map(el => {
// //     const datum = new Date().getFullYear();
// // //     const age = datum - el;
// // //     return age;
// // // })
// // // console.log(ages6);

// // let array = [
// //     { id: 3, name: 'alma' },
// //     { id: 1, name: 'körte' },
// //     { id: 7, name: 'fa' },
// //     { id: 1, name: 'fa' }
// // ];
// // let sortArray = [];

// // array.map(item => {
// //     sortArray[item.id] = item
// // });

// // console.log(array);
// // // sort by value
// // array.sort(function(a, b) {
// //     return a.id - b.id;
// // });
// //név szerint
// // items.sort(function(a, b) { 
// //     return (a.id - b.id) || a.name.localeCompare(b.name); 
// // });


// console.log(array);

// var d = new Date("1970-01-01 08:22:00");
// console.log(d);

// const mapObj = new Map();

// mapObj.set(1, 'tralalalala');




let arraye = [
    { id: 3, name: 'alma' },
    { id: 1, name: 'körte' },
    { id: 7, name: 'fa' },
    { id: 1, name: 'fa' }
];

let elem = arraye.filter(x => x.id > 2 && x.name.includes('f'));

elem.forEach(element => {
    console.log(element);
});