import {
  Get_User_Products,
  Add_Product_Service,
} from "../Services/AdminService.js";

export const Display_My_Product_Page = (req, res, next) => {
  try {
    res.render("AdminPage/MyProduct");
  } catch (err) {
    next(err);
  }
};

export const Display_Admin_Page = async (req, res, next) => {
  try {
    const products = await Get_User_Products(req);

    console.log(products);

    res.render("AdminPage/Index", {
      products: products,
    });
  } catch (err) {
    next(err);
  }
};

export const Process_Admin = async (req, res, next) => {
  try {
    const mode = req.query.mode;

    if (mode === "add-product") {
      console.log("ADD IT");

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

      return;
    }

    // Get user products
    if (mode === "view-product") {
      const products = await Get_User_Products(req);

      return res.status(200).json({
        success: true,
        message: "User product fetched successfuly",
        data: {
          products: products,
        },
      });
    }
  } catch (err) {
    next(err);
  }
};
