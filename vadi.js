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