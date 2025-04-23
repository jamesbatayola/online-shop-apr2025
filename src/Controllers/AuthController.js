export const Display_Signin_Page = (req, res, next) => {
  try {
    res.render("AuthPage/SignIn");
  } catch (err) {
    next(err);
  }
};
