import Product from "../Models/Product.js";

import AdminService from "../Services/AdminService.js";

export const Display_My_Product_Page = (req, res, next) => {
  try {
    res.render("AdminPage/MyProduct");
  } catch (err) {
    next(err);
  }
};

export const Display_Admin_Page = async (req, res, next) => {
  try {
    // const products = await AdminService.Get_User_Products(req);

    res.render("AdminPage/Index");
  } catch (err) {
    next(err);
  }
};

export const Process_Admin = async (req, res, next) => {
  try {
    const payload = await AdminService.Dynamic_Process(req);

    res.status(200).json({
      success: payload.success,
      message: payload.message,
      data: payload.data,
    });
  } catch (err) {
    next(err);
  }
};
