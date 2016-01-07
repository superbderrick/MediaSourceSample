
var pratice = {};

// wrong case
// var mangoFruit = {
// color: "yellow",
// sweetness: 8,
// fruitName: "Mango",
// nativeToLand: ["South America", "Central America"],

// showName: function () {
// console.log("This is " + this.fruitName);
// },
// nativeTo: function () {
//  this.nativeToLand.forEach(function (eachCountry)  {
//             console.log("Grown in:" + eachCountry);
//         });
// }
//}
// wrong case

// good sample to make instance 01
function Fruit (theColor, theSweetness, theFruitName, theNativeToLand) {

    this.color = theColor;
    this.sweetness = theSweetness;
    this.fruitName = theFruitName;
    this.nativeToLand = theNativeToLand;

    this.showName = function () {
        console.log("This is a " + this.fruitName);
    }

    this.nativeTo = function () {
    this.nativeToLand.forEach(function (eachCountry)  {
       console.log("Grown in:" + eachCountry);
        });
    }


}

pratice.showSampleCode = function () {
	var mangoFruit = new Fruit ("Yellow", 8, "Mango", ["South America", "Central America", "West Africa"]);
	mangoFruit.showName(); // Mango
	mangoFruit.nativeTo();
	// Grown in:South America
	// Grown in:Central America
	// Grown in:West Africa

	var pineappleFruit = new Fruit ("Brown", 5, "Pineapple", ["United States"]);
	pineappleFruit.showName(); // Pineapple

}
// good sample to make instance 01


// good sample to make instance 02

// function Fruit () {

// }

// Fruit.prototype.color = "Yellow";
// Fruit.prototype.sweetness = 7;
// Fruit.prototype.fruitName = "Generic Fruit";
// Fruit.prototype.nativeToLand = "USA";

// Fruit.prototype.showName = function () {
// console.log("This is a " + this.fruitName);
// }

// Fruit.prototype.nativeTo = function () {
//             console.log("Grown in:" + this.nativeToLand);
// }

pratice.showSampleCodeTwo = function () {
	
var mangoFruit = new Fruit ();
mangoFruit.showName(); //
mangoFruit.nativeTo();
// This is a Generic Fruit
// Grown in:USA
	var test = 0.5;
    console.log((2.2 | 0)  );

}


