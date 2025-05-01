import Product from "../Models/Product.js";
import Cart from "../Models/Cart.js";

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
		const { product_id } = req.params;

		const res = await Cart.findOrAddProduct(req.user.id, "active", product_id);

		return res;
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

		const cart_item = await Cart.minusProductQuantity(cart_item_id);
		const product = await Product.findById(cart_item.product_id);

		return {
			new_quantity: cart_item.quantity,
			new_total_price: product.price * cart_item.quantity,
		};
	},
};

export default ShopService;
