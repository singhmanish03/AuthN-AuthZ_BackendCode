const express =require("express");
const router=express.Router();

//import controller
const {login,signup} =require("../controllers/auth");
const{auth,isStudent,isAdmin} =require("../middlewares/auth");

//router 
router.post("/login",login);
router.post("/signup",signup);

//one testing routes
router.get("/test",auth,(req,res) => {
    res.json({
        success:true,
        message:"Welcome to protected Route for TESTing",
    });
});

//protected routes
router.get("/student",auth,isStudent,(req,res) => {
    res.json({
        success:true,
        message:"Welcome to protected Route for student",
    });
});

router.get("/admin",auth,isAdmin,(req,res) => {
    res.json({
        success:true,
        message:"Welcome to protected Route for Admin",
    });
});


module.exports=router;
