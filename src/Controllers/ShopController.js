import { Get_Products } from "../Services/ShopService.js";

export const Display_Home_Page = async (req, res, next) => {
  try {
    const products = await Get_Products();

    res.render("ShopPage/Home.ejs", {
      products: products,
    });
  } catch (err) {
    next(err);
  }
};

export const Display_Search_Product = async (req, res, next) => {
  try {
    console.log(req.query.search);
    // res.status(200)
  } catch (err) {
    next(err);
  }
};
