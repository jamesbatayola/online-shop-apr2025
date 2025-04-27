import Product from "../Models/Product.js";

// __diranem & __filename
// import { fileURLToPath } from "url";
// import { dirname } from "path";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

export const Add_Product_Service = async (req) => {
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
