import {
  Signin_Service,
  Email_Verification_Service,
  Reset_Password_Service,
} from "../Services/AuthService.js";

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

    res.cookie("jwt", payload.jwt_token, {
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

export const Display_Email_Verification_Page = async (req, res, next) => {
  try {
    res.render("AuthPage/EmailVerification");
  } catch (err) {
    next(err);
  }
};

export const Process_Email_Verification = async (req, res, next) => {
  try {
    await Email_Verification_Service(req);

    res.status(200).json({
      success: true,
      message: "A link was sent your email",
    });
  } catch (err) {
    next(err);
  }
};

export const Display_Reset_Password_Page = async (req, res, next) => {
  try {
    const { token, user_id } = req.query;

    res.render("AuthPage/ResetPassword", {
      token: token,
      user_id: user_id,
    });
  } catch (err) {
    next(err);
  }
};

export const Process_Reset_Password = async (req, res, next) => {
  try {
    await Reset_Password_Service(req);

    res.status(200).json({
      success: true,
      message: "Changed password successfully",
    });
  } catch (err) {
    next(err);
  }
};
