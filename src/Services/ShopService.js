import Product from "../Models/Product.js";

export const Get_Products = () => {
  const products = Product.findAll();
  return products;
};
