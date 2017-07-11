(function () {
	//	plugin stuff
	var elem = document.querySelector('.grid');
	var msnry = new Masonry(elem, {
		itemSelector: '.grid-item',
		columnWidth: 230
	});
	var msnry = new Masonry('.grid', {});

	//main stuff
	var categories = document.getElementsByClassName('grid-item'),
		products = document.getElementsByClassName('goods')[0],
		grid = document.getElementsByClassName('grid')[0],
		elH2 = document.getElementsByTagName('H2')[0],
		elH3 = document.getElementsByTagName('H3')[0],
		cartSum = document.getElementById('cartSum'),
		backButton = document.getElementById('backButton'),
		cartBackButton = document.getElementById('cartBackButton'),
		dragscrollDiv = document.getElementById('dragScroll'),
		cart = document.getElementsByClassName('cart')[0],
		cartList = [],
		totalPrice = 0;

	for (var i = 0; i < categories.length; i++) {
		//if user holds on category for longer than 0.3s, 
		//then don't open product's list
		categories[i].addEventListener('mousedown', function () {
			var click = true;
			var timeout = setTimeout(function () {
				click = false;
			}, 300)
			this.addEventListener('mouseup', function () {
				if (click == true) {
					var data = this.dataset;
					clickCategory();
					initProducts(data.name);
				}
			})
		})
	}

	function clickCategory() {
		grid.classList.add('dont-display');
		dragscrollDiv.scrollLeft = 0;
		elH2.classList.add('dont-display');
		elH3.classList.remove('dont-display');
		backButton.classList.remove('dont-display');
		products.classList.remove('dont-display');
	}

	backButton.addEventListener('click', function () {
		cart.dataset.redirect = 'home';
		grid.classList.remove('dont-display');
		dragscrollDiv.scrollLeft = 0;
		elH2.classList.remove('dont-display');
		elH3.classList.add('dont-display');
		backButton.classList.add('dont-display');
		products.classList.add('dont-display');

	})

	cartBackButton.addEventListener('click', function () {
		cartBackButton.classList.add('dont-display');
		if (cart.dataset.redirect == 'home') {
			grid.classList.remove('dont-display');
			dragscrollDiv.scrollLeft = 0;
			elH2.classList.remove('dont-display');
			elH3.classList.add('dont-display');
			backButton.classList.add('dont-display');
			products.classList.add('dont-display');
		} else {
			clickCategory();
			initProducts(cart.dataset.redirect);
		}
	})


	cart.addEventListener('click', function () {
		cartBackButton.classList.remove('dont-display');
		elH3.innerHTML = "Your Shopping Cart";
		for (var j = 0; j < cartList.length; j++) {
			if (cartList[j].quantity == 0) {
				cartList.splice(j, 1);
				j--;
			}
		}
		if (cartList.length > 0) {
			clickCategory();
			initCart();
		} else if (cartList.length == 0) {
			clickCategory();
			products.innerHTML = "Your Shopping Cart Is Empty";
			products.style.width = "600px";
		}
		backButton.classList.add('dont-display');

	})

	function updateTotalPrice() {
		cartSum.innerHTML = totalPrice;
	}

	function addToCart(item) {
		var selectedProducts = {};
		var existsProduct = false;
		if (cartList.length > 0) {
			for (var i = 0; i < cartList.length; i++) {
				if (cartList[i].title == item.title) {
					cartList[i].quantity == item.quantity;
					existsProduct = true;
					return;
				}
			}
			if (!existsProduct) {
				cartList.push(item);
			}

		} else {
			cartList.push(item);
		}
	}

	function initCart() {
		var width = (327 + 20) * cartList.length;
		products.innerHTML = "";
		products.style.width = width + 'px';
		for (var i = 0; i < cartList.length; i++) {
			var listItem = createProductItem(cartList, i, true);
			products.appendChild(listItem);
		}
	}

	function initProducts(name) {
		let product = productsList[name],
			width = (327 + 20) * product.items.length;

		cart.dataset.redirect = name;
		products.innerHTML = "";
		elH3.innerHTML = product.title;
		products.style.width = width + 'px';

		for (var i = 0; i < product.items.length; i++) {
			var listItem = createProductItem(product, i, false);
			products.appendChild(listItem);
			var addBtn = document.getElementsByClassName('add-product')[i],
				removeBtn = document.getElementsByClassName('remove-product')[i];

			addBtn.addEventListener('click', function () {
				var amountElm = this.parentNode.getElementsByClassName('amount')[0];
				var count = amountElm.innerHTML;
				++count;
				amountElm.innerHTML = count;
				var data = amountElm.dataset;
				var index = data.index;
				var price = productsList[name].items[index].price;
				productsList[name].items[index].quantity = count;
				var currentProduct = productsList[name].items[index];
				addToCart(currentProduct);
				totalPrice += price;
				updateTotalPrice();
			})

			removeBtn.addEventListener('click', function () {
				var amountElm = this.parentNode.getElementsByClassName('amount')[0];
				var count = amountElm.innerHTML;
				if (count > 0) {
					--count;
					amountElm.innerHTML = count;
					var data = amountElm.dataset;
					var index = data.index;
					productsList[name].items[index].quantity = count;

					var price = productsList[name].items[index].price;
					totalPrice -= price;
					updateTotalPrice();
				}
			})
		}
	}

	function createProductItem(product, i, forCart) {
		var item;
		if (forCart) {
			item = product[i];
			var listItemTemplate = '<figure class="product-item">' +
				'<img src="' + item.image + '" alt="">' +
				'<figcaption>' +
				'<span>' + item.title + '</span>' +
				'<span class="product-price">' + item.price + '</span>' +
				'</figcaption>' +
				'</figure>' +
				'<section class="add-to-cart">' +
				'<span>amount</span>' +
				'<section class="amount" data-index="' + i + '">' + item.quantity + '</section>' +
				'</section>';
		} else {
			item = product.items[i];
			var listItemTemplate = '<figure class="product-item">' +
				'<img src="' + item.image + '" alt="">' +
				'<figcaption>' +
				'<span>' + item.title + '</span>' +
				'<span class="product-price">' + item.price + '</span>' +
				'</figcaption>' +
				'</figure>' +
				'<section class="add-to-cart">' +
				'<span>amount</span>' +
				'<div class="remove-product">-</div>' +
				'<div class="add-product">+</div>' +
				'<section class="amount" data-index="' + i + '">' + item.quantity + '</section>' +
				'</section>';
		}
		var listItem = document.createElement('div');
		listItem.classList.add('product');
		listItem.innerHTML = listItemTemplate;
		return listItem;
	}
})()
