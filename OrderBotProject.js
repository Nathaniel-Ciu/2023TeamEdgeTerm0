/* -------------------------------------------- 

	You've just learned about variables, conditionals, functions, and user input. 
	You've also created a basic calculator in a previous project.
	
	Now imagine you are going out to eat with two other friends.
	Are you at a restaurant for a meal? Are you grabbing boba? Or are you just going to an ice cream parlor?
	At the end of the meal, you and your friends have to split the bill. 

	Wouldn't it be great if we could automate that math?

					Let's try it!

  -------------------------------------------- 

Scenario Parameters: 

	When you and your friends eat out, each of you have the option to order one or multiple items.
	What kind of items are available to order?

	At the end of the order, the receipt comes and you all have to calculate the cost for each person:
	Don't forget the tax and tip!

After this program finishes running, it should output a specific total for each person

  -------------------------------------------- */

/* 
	Nathaniel Ciu 7/11/23

	BUGS TO FIX
	groupSize accepts non-numbers
	Tax is calculated after tip, IDK if that's the norm - research how tax works 

	NOTE 
	* Have ignored the scaffolding completely (I'm sorry King Julian and Jeremy - aka. "JJ" - also to whomever else wanted to see a particular scaffolding part)
	* Have not tested on larger groups (I don't want to do that)
	* Have not tested extensively (in general)
	* Code is terrible for updating/maintaining 
	 - Ex.) If you want to add another food to the menu you have to (Note that the line # are Subject to change and I'm lazy to update, it go command f it mate)
		1.) Create a new Food object								| Line 66
		2.) Add it to the menu 										| Line 70 
		3.) Add it to the comparision menu 							| check note for why that exist - Line 69 <-- Nice
		4.) Add it to calculateTotalPrice() 						| Line 167
		5.) Add it to personCalculateTotalPrice() 					| check note for why this exist - Line 183
		6.) Add it to the calculation of group reciept 				| Line 241
		7.) Add it to the calculation of individual reciepts 		| Line 301
	
	* A lot of repeated code that might've could've been made into a function (Particularly Receipt Generating but also checking for valid input functions)

*/

const tax = 8.875

let order = [];
let addToOrder;
let wantOrder;

let people = [];

function Food(name, price) {
	this.name = name;
	this.price = price;
}

function customer (name) {
	this.name = name;
	this.order = [];
	this.cost = 0;
	this.tip = 0;
}

const Hamburger = new Food("Hamburger", 8.00);
const Cheeseburger = new Food("Cheeseburger", 9.00);
const Porkchops = new Food("Porkchops", 12.00);
const InfernoWings = new Food("Inferno Wings", 15.00)


let menu = [Hamburger,  Cheeseburger, Porkchops, InfernoWings];
let comparisionMenuForCheck = ["Hamburger",  "Cheeseburger", "Porkchops", "Inferno Wings"]; // Because checking for object elements is hard - Needs More Research

// ***** NOTE TO SELF : Think of a way to combine the check functions *****

function checkGroupSizeInput() { //Fix so groupSize doesn't accept characters 
	try {
		if (groupSize < 0 ) {
			throw new Error("");
		}
	} catch {
		console.log("Please input valid group size");
		groupSize = READLINE.question("How many people eating today?: ");
		checkGroupSizeInput();
	}
}

function checkMenuInput() {
	try { 
		if (wantMenu != "NO" && wantMenu != "YES") {
			throw new Error('Please type "YES" or "NO"'); 
		} 
	} catch {
		console.log('Please type "YES" or "NO"'); 
		wantMenu = READLINE.question("Would you like today's menu? (YES/NO): ");
		checkMenuInput();
	}
}

function checkGroupTabInput() {
	try { 
		if (wantGroupTab != "NO" && wantGroupTab != "YES") {
			throw new Error('Please type "YES" or "NO"'); 
		} 
	} catch {
		console.log('Please type "YES" or "NO"'); 
		wantGroupTab = READLINE.question("Would you like pay as a group? (YES/NO): ");
		checkGroupTabInput();
	}
}

function checkWantOrderInput() {
	try { 
		if (wantOrder != "NO" && wantOrder != "YES") {
			throw new Error('Please type "YES" or "NO"'); 
		} 
	} catch {
		console.log('Please type "YES" or "NO"'); 
		wantOrder = READLINE.question("Would you like to order something (YES/NO): ");
		checkWantOrderInput();
	}
}

function checkAddToOrderInput() {
	try { 
		if (comparisionMenuForCheck.indexOf(addToOrder) == -1) {
			throw new Error('Please Type Valid Food Item');
		}
	} catch {
		console.log('Please Type Valid Food Item'); 
		addToOrder = READLINE.question("What would you like to order? : ");
		checkAddToOrderInput();
	}
}

function checkPersonAddToOrderInput() {
	try { 
		if (comparisionMenuForCheck.indexOf(personAddToOrder) == -1) {
			throw new Error('Please Type Valid Food Item');
		}
	} catch {
		console.log('Please Type Valid Food Item'); 
		personAddToOrder = READLINE.question("What would you like to order? : ");
		checkPersonAddToOrderInput();
	}
}

function checkTipInput() {
	try {
		if (tip < 0) {
			throw new Error("No negative tips sorry");
		}
	} catch {
		console.log("Please enter in tips percentage greater than or equal to 0");
		tip = READLINE.question("Leave 0% | 15% | 18% | 20% | Custom (Enter Any #) Tip: ");
		checkTipInput();
	}
}

// ***** END OF CHECK FUNCTIONS *****

function printMenu() {
	for (let offset = 0; offset < menu.length; offset++) {
		console.log(menu[offset]);
	}
}

function calculateTotalPrice() {
	totalCost = 0; 
	for (let offset = 0; offset < order.length; offset++) {
		if (order[offset] == "Hamburger") {
			totalCost += Hamburger.price;
		} else if (order[offset] == "Cheeseburger") {
			totalCost += Cheeseburger.price;
		} else if (order[offset] == "Porkchops") {
			totalCost += Porkchops.price;
		} else if (order[offset] == "Inferno Wings") {
			totalCost += InfernoWings.price;
		}
	}
	return totalCost;
}

function personCalculateTotalPrice() { // Different list is accesses for individual bills 
	totalCost = 0; 
	for (let offset = 0; offset < person.order.length; offset++) {
		if (person.order[offset] == "Hamburger") {
			totalCost += Hamburger.price;
		} else if (person.order[offset] == "Cheeseburger") {
			totalCost += Cheeseburger.price;
		} else if (person.order[offset] == "Porkchops") {
			totalCost += Porkchops.price;
		} else if (person.order[offset] == "Inferno Wings") {
			totalCost += InfernoWings.price;
		}
	}
	return totalCost;
}



const READLINE = require("readline-sync");
console.log("***** Welcome to Eric's Eatery *****");
let name = READLINE.question("Enter your name: ");
let groupSize = READLINE.question("How many people eating today?: "); 
checkGroupSizeInput();
let wantMenu = READLINE.question("Would you like today's menu? (YES/NO): ");
checkMenuInput();

if (wantMenu == "YES") {
	console.log("\n")
	printMenu();
	console.log("\n")
}

let wantGroupTab = READLINE.question('Would you like pay as a group? (YES/NO): ');
checkGroupTabInput();

if (wantGroupTab == "YES") { // GROUP PAY
	wantOrder = "YES";
	while (wantOrder == "YES") {
		addToOrder = READLINE.question("What would you like to order?: ");
		checkAddToOrderInput();
		order.push(addToOrder);

		console.log("\nTable's Order So Far: ");
		for (let offset = 0; offset < order.length; offset++) {
			console.log(order[offset]);
		}
		
		console.log("\nTotal Cost is " + calculateTotalPrice().toFixed(2) + "\n");

		wantOrder = READLINE.question("Would you like to order something else? (YES/NO) : ");
		checkWantOrderInput();
	}
	console.log("\nTips are OPTIONAL (We pay our workers fair wages)");
	tip = READLINE.question("Leave 0% | 15% | 18% | 20% | Custom (Enter Any #) Tip: ");
	checkTipInput();


	// ***** GENERATING THE GROUP RECEIPT *****
	console.log("\nHere's Your receipt: \n");
	console.log(name + "'s group");
	tempTablePrice = 0;
	for (let offset = 0; offset < order.length; offset++) {
		if (order[offset] == "Hamburger") {
			console.log("Hamburger ------  " + Hamburger.price); 
			tempTablePrice += Hamburger.price;
		} else if (order[offset] == "Cheeseburger") {
			console.log("Cheeseburger ---  " + Cheeseburger.price);
			tempTablePrice += Cheeseburger.price;
		} else if (order[offset] == "Porkchops") {
			console.log("Porkchops ------ " + Porkchops.price);
			tempTablePrice += Porkchops.price;
		} else if (order[offset] == "Inferno Wings") {
			console.log("Inferno Wings -- " + InfernoWings.price);
			tempTablePrice += InfernoWings.price;
		}
	}
	costWithTip = calculateTotalPrice() + calculateTotalPrice() * (tip / 100);
	costWithTipAndTax = costWithTip + (costWithTip * tax / 100);

	console.log("\nPrice before tip : " + tempTablePrice);
	
	console.log("\nTip is " + tip + "%")
	console.log("Price w/ tip : " + costWithTip.toFixed(2));
	console.log("Pirce w/ tax : " + costWithTipAndTax.toFixed(2));
	


} else { // INDIVIDUAL PAY
	for (let offset = 0; offset < groupSize; offset++) {
		personName = READLINE.question("Who's order (Enter a name): ");
		person = new customer(personName);
		wantOrder = "YES";
		while (wantOrder == "YES") {
			personAddToOrder = READLINE.question("What would you like to order?: ");
			checkPersonAddToOrderInput();
			person.order.push(personAddToOrder);

			console.log("\n" + personName + " Order So Far: ");
			for (let offset = 0; offset < person.order.length; offset++) {
				console.log(person.order[offset]);
			}
			personPrice = personCalculateTotalPrice();
			console.log("\nTotal Cost is " + personPrice.toFixed(2) + "\n");

			wantOrder = READLINE.question("Would you like to order something else? (YES/NO) : ");
			checkWantOrderInput();
		}
		console.log("\nTips are OPTIONAL (We pay our workers fair wages)");
		tip = READLINE.question("Leave 0% | 15% | 18% | 20% | Custom (Enter Any #) Tip: "); // doesn't check for invalid check
		checkTipInput();
		person.tip = tip;
		person.cost = personCalculateTotalPrice() + personCalculateTotalPrice() * (tip / 100) + ((personCalculateTotalPrice() + personCalculateTotalPrice() * (tip / 100)) * (tax / 100));
		console.log("\nFinal cost for " + person.name + " is $" + person.cost.toFixed(2) + " including tax\n");
		people.push(person);
	}

	// ***** GENERATING THE INDIVIDUAL RECEIPTS *****
	console.log("\nHere is what each person ordered");
	for (let outer = 0; outer < people.length; outer++) {
		priceForIndividual = 0;
		console.log(people[outer].name + "'s reciept");
		for (let inner = 0; inner < people[outer].order.length; inner++) {
			if (people[outer].order[inner] == "Hamburger") {
				console.log("Hamburger ------  " + Hamburger.price); 
				priceForIndividual += Hamburger.price;
			} else if (people[outer].order[inner] == "Cheeseburger") {
				console.log("Cheeseburger ---  " + Cheeseburger.price);
				priceForIndividual += Cheeseburger.price;
			} else if (people[outer].order[inner] == "Porkchops") {
				console.log("Porkchops ------ " + Porkchops.price);
				priceForIndividual += Porkchops.price;
			} else if (people[outer].order[inner] == "Inferno Wings") {
				console.log("Inferno Wings -- " + InfernoWings.price);
				priceForIndividual += InfernoWings.price;
			}
		}

		console.log("\nPrice before tip : " + priceForIndividual);

		priceWithTip = priceForIndividual + priceForIndividual * (people[outer].tip / 100);
		priceWithTipAndTax = priceWithTip + priceWithTip * (tax / 100);
		console.log("\nTip is " + people[outer].tip);
		console.log("Price w/ Tip : " + priceWithTip.toFixed(2));
		console.log("Price w/ tax : " + priceWithTipAndTax.toFixed(2) + "\n")
		
	}

}

console.log("\nThanks for eating at Eric's Eatery");

console.log("\n");







 


/* -------------------------------------------- 

Part 1:
Let's start by asking taking the order of the group(you and two friends). What did each person order?

Write a function that will take the group's order:
- Prompt the user to enter the price of each item they ordered
- Return the cost 

Remember! Functions are meant to be reusable, so write a function that will work when called for each person!

-------------------------------------------- */












/* -------------------------------------------- 

Part 2:
Now that you have the costs of everything ordered, let's calculate the cost of each person's order(including tip and tax).

Write a function that will calculate the cost of each person's order, including:
- Cost of all of their ordered items
- Tax (Look up the sales tax of your city)
- Tip (Give the user the option to enter how much they want to tip)

Remember! Functions are meant to be reusable, so write a function that will work when called for each person!

-------------------------------------------- */












/* -------------------------------------------- 

Part 3:
Let's print out a receipt for each person.

Write a function that will take the values of each person's order and total cost and print it out in an appealing way.

The receipt should include:
- Cost of each item
- Total cost for each person

Remember! Functions are meant to be reusable, so write a function that will work when called for each person!

-------------------------------------------- */










/* -------------------------------------------- 

Part 4: Upchallenges!

How many of these upchallenges can you implement?

- Make sure the user is only entering numbers. If they enter an invalid value, prompt them to re-enter. 
- The displayed prices should only have two decimal places.
- Can you adjust your program to account for any shared items ordered for the group?
- Display the tax and tip values
- Implement a rewards system (stamp cards, buy one get one, etc)

-------------------------------------------- */
