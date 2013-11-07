
$(function(){
	/* populates menu on document load */
	populateMenu();

});

/* populates all of the menu items by calling appropriate functions */
function populateMenu() {
	/* creates category headings for each menu item */
	createHeadings();
	/* adds pizza menu items */
	appendPizza();
	/* adds drinks menu */
	appendOtherFoods(com.dawgpizza.menu.drinks, $("#drinks"));
	/* adds desserts menu */
	appendOtherFoods(com.dawgpizza.menu.desserts, $("#desserts"));

}

/* adds pizza menu items */
function appendPizza()
{
	/* pizzas */
	var idx;
	var pizzaList
	var pizza;
	var pizzaName;
	var pizzaDesc;
	var pizzaPrice;
	var menuPizzas = com.dawgpizza.menu.pizzas;

	/* creates dictionary list to hold pizza names, descriptions, and prices */	
	createPizzaLists(pizzaList, "dl", "pizza-list", "#pizzas"); 
	/* goes through each pizza type and creates an element for pertinent info, 
	   like the name, description, and price
	*/
	$.each(menuPizzas, function() {
		pizza = this;
		/* creating pizza name element */
		createPizzas(pizzaName, 'dt', null, pizza.name);
		/* creating pizza description element */
		createPizzas(pizzaDesc, 'dd', null, pizza.description);
		/* formatiing prices */
		var pricing;
		pricing = pizza.prices[0];
 		for(idx = 1; idx < pizza.prices.length; idx++) {
			pricing += "/" + pizza.prices[idx];
		}
		/* creating pizza prices element */
		createPizzas(pizzaPrice, 'span', 'pricing', pricing);
	});
}

/* creates an element for specific pizzas and stores it in a variable, 
   adds a class and content to said element, and then appends it to the
   pizza list
*/
function createPizzas(type, element, className, content) {
	type = $(document.createElement(element));
	type.addClass(className);
	type.html(content);
	$(".pizza-list").append(type);
}

/* creates an element for specific pizzas and stores it in a variable, 
   adds a class BUT NO content to said element, and then appends it to the
   specified location; differs from createPizzas because the location
   to which the element is appended is up to the user, and they also cannot
   add html to the element
*/
function createPizzaLists(type, element, className, appendTo) {
	type = $(document.createElement(element));
	type.addClass(className);
	$(appendTo).append(type);
}

/* appends the menu items for non-pizza foods/drinks,
   taking in the item's namespace and the selector for 
   where the menu items should be appended
*/
function appendOtherFoods(item, appendTo) {
	$.each(item, function() {
		var itemName = $(document.createElement('h5'));
		itemName.html(this.name + " - ");
		var itemPrice = $(document.createElement('span'));
		itemPrice.attr({
			class: "drink-prices"
		});
		itemPrice.html(this.price);
		itemName.append(itemPrice);
		$(appendTo).append(itemName);
	});
}

/* creates the headings for each of the section based on the
   captions within the com.dawgpizza.menuCategories
*/
function createHeadings() {
	$.each($("section"), function(index) {
		var heading = $(document.createElement('h4'));
		var itemType = com.dawgpizza.menuCategories[index].caption;
		heading.html(itemType);
		$("#" + itemType.toLowerCase()).append(heading);
	})
	
}