$(function () {
    // populates menu on document load
    populateMenu();

    //create a cart model as a simple object with
    //the properties we eventually need to post to
    //the server
    var cart = {
        name: null,
        address1: null,
        zip: null,
        phone: null,
        items: [] //empty array
    }; //cart data

    //click event handler for all buttons with the
    //style class 'add-to-cart'
    $('.add-to-cart').click(function () {
        //increases the quantity of a certain item if user selects it again
        var increasedQuantity = 1 + parseInt(this.getAttribute('data-quantity'));
        $(this).attr({
            "data-quantity": increasedQuantity
        });
        //use the attributes on the button to construct
        //a new cart item object that we can add to the
        //cart's items array
        var newCartItem = {
            type: this.getAttribute('data-type'),
            name: this.getAttribute('data-name'),
            size: this.getAttribute('data-size'),
            price: this.getAttribute('data-price'),
            quantity: increasedQuantity
        }
        //pushes item into array first time just to get it started
        if (cart.items.length === 0) {
            cart.items.push(newCartItem);
        } else {
            var i;
            var present = false; //used to check if item has already been added for quantity
            //loops through indices in array to check if item is present,
            //if it is, present = true and it replaces the existing quantity
            //with the new quantitu
            for (i = 0; i < cart.items.length; i++) {
                if (cart.items[i].name == this.getAttribute('data-name') &&
                    cart.items[i].size == this.getAttribute('data-size')) {
                    cart.items[i] = newCartItem;
                    console.log("present!");
                    present = true;
                }
            }
            //if item isn't present, creates a new cart item so it can display it
            if (!present) {
                console.log("not present!");
                cart.items.push(newCartItem);
            }
        }
        //render the cart's contents to the element
        //we're using to contain the cart information
        //note that you would need a <div> or some
        //other grouping element on the page that has a
        //style class of 'cart-container'
        renderCart(cart, $('.cart-container'));
        console.log(cart.items);
    });

    //click event handler for all buttons with the
    //style class 'remove-item' - the X button
    $(".remove-item").click(function () {
        //use the data-index attribute to remove the
        //cart item whose remove button was chosen
        var idxToRemove = this.getAttribute('data-index');
        cart.items.splice(idxToRemove, 1);
        //render cart's elements
        renderCart(cart, $('.cart-container'));
    });

    //click event handler for all buttons with the
    //id '#done' - it will show form information
    //if the user has entered at least one item in cart
    $("#done").click(function () {
        if (cart.items.length === 0) {
            alert("Please add at least one item to your cart!");
        } else {
            $(this).fadeOut(function () {
                $("#submit").fadeIn(); //fades in new "Submit" button
            });

            $("#personal-info").fadeIn(); //fades in form info

        }
    });

    //click event handler for "Start Over" button with the
    //style class 'restart-order' - asks user for confirmation 
    //if they want to restart, and if so, resets array to 0 length
    $(".restart-order").click(function () {
        if (cart.items.length > 0) {
            if (confirm("Is it OK to restart your order?")) {
                cart.items.length = 0; //clears array
                //change quantity for all items in cart to 0
                $(".add-to-cart").each(function () {
                    $(this).attr({
                        "data-quantity": 0 //sets quantities to 0
                });
                $("#submit").fadeOut(function(){
                    $("#done").fadeIn();
                    $("#personal-info").fadeOut();
                });
                renderCart(cart, $('.cart-container'));
                
                
            });
            }

        }
    });

    //click event handler for "Submit" button with the
    //id 'submit' - validates user has entered in required information 
    //and posts it
    $("#submit").click(function () {
        console.log("Hello");
        var formGroup = $("#personal-info");
        if (validateFields("#name", formGroup, cart) &&
            validateFields("#address1", formGroup, cart) &&
            validateFields("#zip", formGroup, cart) &&
            validateFields("#phone", formGroup, cart)) {
            console.log(cart);
            postCart(cart, $(".order-top"));
            alert("Thank you for ordering! We'll be there in 20 minutes or less!"); //confirmation dialog
            window.location = "index.html"; //sends user away after conf. dialog
        }
    });
});


// validates that user has entered a value in "field"
function validateFields(field, formGroup, cart) {
    var reqField = formGroup.find(field);
    var reqValue = reqField.val().trim();
    if (0 === reqValue.length) {
        alert("You must enter a " + reqField.attr("placeholder") + ".");
    } else {
        //if fields are valid, adds them as values for the keys in the object
        var actualField = field.substring(1);
        cart[actualField] = reqField.val();
        return true;
    }
}

// renderCart()
// renders the current cart information to the screen
// parameters are:
//  - cart (object) reference to the cart model
//  - container (jQuery object) reference to the container <div>
//
function renderCart(cart, container) {
    var idx, item;
    var subtotal = 0.00;
    //empty the container of whatever is there currently
    container.empty();

    //for each item in the cart...
    for (idx = 0; idx < cart.items.length; ++idx) {
        item = cart.items[idx];
        var cartItemView = $(".templates .cart-item-template").clone();
        cartItemView.removeClass("cart-item-template");
        var size;
        if (item.size === null) {
            size = "";
        } else {
            size = item.size;
        }
        cartItemView.find(".size").html(item.quantity + " " + size);
        var itemName = item.name;
        if (item.quantity > 1) {
            itemName = itemName + "s";
        }
        cartItemView.find(".title").html(itemName);
        cartItemView.find(".remove-item").attr({
            "data-index": idx
        });
        var price = parseInt((item.price * item.quantity));
        cartItemView.find(".price").html("$" + price);
        container.append(cartItemView);
        subtotal = subtotal + price;
        console.log(subtotal);
        //TODO: code to render the cart item
    } //for each cart item

    //renders tax amount and total
    var tax = parseFloat((subtotal * 0.095).toFixed(2));
    var total = parseFloat((tax + subtotal).toFixed(2));
    $(".cart-footer .subtotal").html("$" + subtotal);
    $(".cart-footer .tax").html("$" + tax);
    $(".cart-footer .total").html("$" + total);
} //renderCart()

// postCart()
// posts the cart model to the server using
// the supplied HTML form
// parameters are:
//  - cart (object) reference to the cart model
//  - cartForm (jQuery object) reference to the HTML form
//
function postCart(cart, cartForm) {
    //find the input in the form that has the name of 'cart'    
    //and set it's value to a JSON representation of the cart model
    cartForm.find('input[name="cart"]').val(JSON.stringify(cart));
    $.post("http://dawgpizza.com/orders/", function () {
        console.log("POSTed!");
    });
    //submit the form--this will navigate to an order confirmation page
    cartForm.submit();

} //postCart()

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
function appendPizza() {
    /* pizzas */
    var idx;
    var pizzaList
    var pizza;
    var pizzaName;
    var pizzaDesc;
    var pizzaPrice;
    var menuPizzas = com.dawgpizza.menu.pizzas;

    /* creates dictionary list to hold pizza names, descriptions, and prices */
    createPizzaLists(pizzaList, "dl", "pizza-list", "#order-pizza");
    /* goes through each pizza type and creates an element for pertinent info, 
	   like the name, description, and price
	*/
    $.each(menuPizzas, function () {
        pizza = this;
        /* creating pizza name element */
        var pizzaDiv = $(document.createElement("div"));
        createPizzas(pizzaName, 'dt', null, pizza.name);
        /* creating pizza description element */
        createPizzas(pizzaDesc, 'dd', null, pizza.description);
        /* formatiing prices */
        var pricing;
        pricing = pizza.prices[0];
        for (idx = 1; idx < pizza.prices.length; idx++) {
            pricing += "/" + pizza.prices[idx];
        }
        /* creating pizza prices element */
        var pizzaButtons = $(".templates .pizza-pricing").clone();
        var small = pizzaButtons.children("#sm");
        small.attr({
            "data-name": pizza.name,
            "data-price": pizza.prices[0]
        }).append(pizza.prices[0]);
        var medium = pizzaButtons.children("#md");
        medium.attr({
            "data-name": pizza.name,
            "data-price": pizza.prices[1]
        }).append(pizza.prices[1]);
        var large = pizzaButtons.children("#lg");
        large.attr({
            "data-name": pizza.name,
            "data-price": pizza.prices[2]
        }).append(pizza.prices[2]);
        $(".pizza-list").append(pizzaButtons).append("<hr>");
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
    $.each(item, function () {
        var type = this.type;
        var name = this.name;
        var price = this.price;
        var otherFoodButtons = $(".templates #other-food").clone();
        otherFoodButtons.attr({
            "data-type": type,
            "data-name": name,
            "data-price": price
        });
        otherFoodButtons.html(name + " - $" + price);
        otherFoodButtons.appendTo($("#" + type));
    });
}

/* creates the headings for each of the section based on the
   captions within the com.dawgpizza.menuCategories
*/
function createHeadings() {
    $.each($("section"), function (index) {
        var heading = $(document.createElement('h4'));
        var itemType = com.dawgpizza.menuCategories[index].caption;
        heading.html(itemType);
        $("#" + itemType.toLowerCase()).append(heading);
    })

}