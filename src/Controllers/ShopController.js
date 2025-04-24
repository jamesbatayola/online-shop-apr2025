export const Display_Home_Page = (req, res, next) => {
  try {
    res.render("ShopPage/Home.ejs", {
      user_id: req.user.id,
    });
  } catch (err) {
    next(err);
  }
};
