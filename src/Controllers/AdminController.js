import { Add_Product_Service } from "../Services/AdminService.js";

export const Display_My_Product_Page = (req, res, next) => {
  try {
    res.render("AdminPage/MyProduct");
  } catch (err) {
    next(err);
  }
};

export const Display_Add_Product_Page = (req, res, next) => {
  try {
    res.render("AdminPage/AddProduct");
  } catch (err) {
    next(err);
  }
};

export const Display_Edit_Product_Page = (req, res, next) => {
  try {
    //   res.render("AdminPage/MyProduct");
  } catch (err) {
    next(err);
  }
};

export const Process_Add_Product = async (req, res, next) => {
  try {
    const product = await Add_Product_Service(req);

    res.status(200).json({
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
    });
  } catch (err) {
    next(err);
  }
};
