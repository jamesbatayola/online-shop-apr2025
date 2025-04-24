export const Display_Home_Page = (req, res, next) => {
  try {
    res.render("ShopPage/Home.ejs");
  } catch (err) {
    next(err);
  }
};
