import { Signin_Service } from "../Services/AuthService.js";

export const Display_Signin_Page = (req, res, next) => {
  try {
    res.render("AuthPage/SignIn");
  } catch (err) {
    next(err);
  }
};

export const Display_Signup_Page = (req, res, next) => {
  try {
    res.render("AuthPage/SignUp");
  } catch (err) {
    next(err);
  }
};

export const Process_Signin = async (req, res, next) => {
  try {
    const payload = await Signin_Service(req); // Will throw potential error

    console.log(payload.user);
    console.log(payload.jwt);

    res.cookie("jwt", payload.jwt, {
      httpOnly: true, // XSS protection
      sameSite: "Strict", // CSRF protection
      maxAge: 3600000, // 1 hour (in milliseconds)
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user_id: payload.user.id,
        user_email: payload.user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const Display_Email_Verification_Page = (req, res, next) => {
  try {
    res.render("AuthPage/EmailVerificationPage");
  } catch (err) {
    next(err);
  }
};
