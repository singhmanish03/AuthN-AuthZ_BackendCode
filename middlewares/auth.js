//auth isStudent isAdmin
const jwt = require("jsonwebtoken");
require("dotenv").config();

//authenticity check  

exports.auth = (req, res, next) => {   //next means to follow odering 
  try {
    // console.log("body", req.body.token);
    //extract jwt token so we have three ways to extract  by body ,cookie and header and header is safe
    const token =
      req.body.token ||
      req.body.cookies ||
      req.header("Authorization").replace("Bearer", "");
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "token missing",
      });
    }

    //verify the token
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);   // it will give decoded value of token
      console.log(payload);
      req.user = payload;      // we will use to check the role of user so taken everything to req
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }
    next();          //for next middleware 
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "something went wrong middleware",
    });
  }
};

// authorization  here for student and admin 

exports.isStudent = (req, res, next) => {
  try {
    if (req.user.role != "Student") {
      return res.status(401).json({
        success: false,
        message: "This is protected route for student",
      });
    }
    next();
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: "user role cannot be verified",
    });
  }
};


exports.isAdmin = (req, res, next) => {
  try {
    if (req.user.role != "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is protected route for admin",
      });
    }
    next();
  } catch (error) {
    return res.status(501).json({
      success: false,
      message: "user role cannot be verified",
    });
  }
};
