import Product from "../Models/Product.js";
import Cart from "../Models/Cart.js";
import CartItem from "../Models/CartItem.js";
import Checkout from "../Models/Checkout.js";
import CheckoutItem from "../Models/CheckoutItems.js";

const ShopService = {
	async fetch_products() {
		const products = Product.findAll();
		return products;
	},

	// fetch carts products of user
	async fetch_cart_products(req) {
		const user_cart = await Cart.findOrCreate(req.user.id, "active");

		const cart_products = await Cart.findProducts(user_cart.id);
		return cart_products;
	},

	async add_to_cart(req) {
		console.log("A");

		const { product_id } = req.params;

		// find user cart
		const cart = await Cart.findOrCreate(req.user.id);

		const cart_item = await CartItem.findByCartAndProduct(cart.id, product_id);

		// check cart item existance
		if (!cart_item) {
			return await CartItem.addItems(cart.id, product_id); // insert new cart item
		} else {
			return await Cart.addProductQuantity(cart_item.id); // increment quantity
		}
	},

	async display_cart_products(cart_id, product_id) {
		const cart_item = await Cart.findProduct(cart_id, product_id);

		if (!cart_item) {
			const err = new Error("Cart item does not exist");
			err.statusCode = 404;
			throw err;
		}

		const product = await Product.findById(product_id);

		return {
			cart_item_id: cart_item.id,

			image: product.image_url,
			name: product.name,
			description: product.description,
			quantity: cart_item.quantity,
			price_each: product.price,
			price_total: product.price * cart_item.quantity,
		};
	},

	// must returns new quantity
	async plus_cart_product(req) {
		const { cart_item_id } = req.params;

		const cart_item = await Cart.addProductQuantity(cart_item_id);
		const product = await Product.findById(cart_item.product_id);

		return {
			new_quantity: cart_item.quantity,
			new_total_price: product.price * cart_item.quantity,
		};
	},

	async minus_cart_product(req) {
		const { cart_item_id } = req.params;
		const { current_quantity } = req.body;

		let new_quantity;
		let new_total_price;

		if (current_quantity === 1) {
			await this.remove_cart_product(req);
			new_quantity = 0;
			new_total_price = 0;
		} else {
			const cart_item = await Cart.minusProductQuantity(cart_item_id);
			const product = await Product.findById(cart_item.product_id);

			new_quantity = cart_item.quantity;
			new_total_price = product.price * cart_item.quantity;
		}

		return {
			new_quantity: new_quantity,
			new_total_price: new_total_price,
		};
	},

	async remove_cart_product(req) {
		const { cart_item_id } = req.params;

		const cart_item = await Cart.removeProduct(cart_item_id);

		return { cart_item };
	},

	async cart_checkout(req) {
		const { cart_id } = req.params;

		const cart_items = await CartItem.findByCart(cart_id);

		const checkout_items_display = [];

		const checkout = await Checkout.create(cart_id);

		for (let cart_item of cart_items) {
			const product = await Product.findById(cart_item.product_id);
			const total_price = product.price * cart_item.quantity;

			const checkout_item = await CheckoutItem.create(checkout.id, cart_id, product.id, cart_item.quantity, total_price);

			checkout_items_display.push(checkout_item);

			// Cart Items is now removed
			await CartItem.removeById(cart_item.id);
		}

		await Cart.cartInactive(cart_id); // old cart becomes inactive

		await Cart.create(req.user.id); // new cart added

		return { checkout_items_display };
	},

	async get_checkout_items(req) {
		const carts = await Cart.findCheckouts(req.user.id); // list of checked out carts

		if (!carts) {
			return console.log("CART DOES NOT EXIST");
		}

		const checkouts = [];

		for (let cart of carts) {
			const _checkout = await Checkout.findByCartAndOnProcess(cart.id);

			const temp = {
				checkout_id: _checkout.id,
				items: await CheckoutItem.findByCheckoutId(_checkout.id),
			};

			checkouts.push(temp);
		}

		return { checkouts };
	},

	async removeCheckout(req) {
		const { checkout_id } = req.body;

		const checkout = await Checkout.remove(checkout_id);

		console.log(checkout);

		await Cart.remove(checkout.cart_id); // removes the cart linked to the checkout

		return { checkout };
	},
};

export default ShopService;
