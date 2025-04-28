import Product from "../Models/Product.js";

// ------- PRIVATE ------- //
const _postAddProduct = async (req) => {
  const file = req.file;
  const { name, price, description } = req.body;

  let image_url;

  if (!file) {
    image_url = "null";
  } else {
    image_url = file.filename;
  }

  const product = await Product.create(
    name,
    price,
    image_url,
    description,
    req.user.id
  );

  return product;
};

const _getUserProducts = async (req) => {
  const products = await Product.findByUserId(req.user.id);
  return products;
};

// Main
const AdminService = {
  async Dynamic_Process(req) {
    const mode = req.query.mode;

    if (mode === "add-product") {
      const product = await _postAddProduct(req);

      return {
        success: true,
        message: "Product added successfully",
        data: {
          product: {
            name: product.name,
            price: product.price,
            description: product.description,
            image_url: product.image_url,
            seller: product.user_id,
          },
        },
      };
    }

    // Get user products
    if (mode === "view_products") {
      const products = await _getUserProducts(req);

      return {
        success: true,
        message: "User products fetched successfuly",
        data: {
          products: products,
        },
      };
    }

    if (mode === "view_product" && req.query.id) {
      const product_id = req.query.id;

      const product = await Product.findById(product_id);

      return {
        success: true,
        message: "User product fetched successfully",
        data: {
          product: product,
        },
      };
    }
  },
};

export default AdminService;
