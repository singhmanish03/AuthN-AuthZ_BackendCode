const bcrypt=require("bcrypt"); 
const User=require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config(); 

//signup work flow 
exports.signup =async (req,res) => {
    try{
        const {name,email,password,role} =req.body;
        //check if the user already exits  if found then no need to move forward
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists",
            })
        }

        //secure password 
        let hashedPassword;
        try{
            hashedPassword =await bcrypt.hash(password,10);  //10 is the optimal number of round to hash it 
        }
        catch(err){
            return res.status(400).json({
                success:false,
                message: " Error in hashing password",
            });
        }
        
        //create entry for an user 
        const user =await User.create({
            name,email,password:hashedPassword,role
        })

        return res.status(200).json({
            success:true,
            message:"User created Successfully guys"
        });

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"USer cannot be registered Try again later ",
        });
    }
}


//login
exports.login=async (req,res) => {
    try{
        //get data
        const {email,password} =req.body;
        //validation on email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"Please fill the deitals carefully",
            });
        }
        //check user 
        let user =await User.findOne({email});
        //if not a registerd user 
        if(!user){
            return res.status(401).json({
                    success:false,
                    message:"User not found",
            });
        }

        //making payload for checking 
        const payload ={
            email:user.email,
            id:user._id,
            role:user.role,
        };
        //check password and generator JWT token 
        
        if(await bcrypt.compare(password,user.password)){
            //password match
            let token =jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn :"2h",
            });
        
            //sending all things to user in token
            user=user.toObject();
            //to object ke bina bhi hota hai but dont know why not running 
            
            user.token = token;  //check once this because token is not entered here 
            //but we need to remove password else hacker will easily access.
            user.password=undefined; //password will be removed from user but it will remain in database
            console.log(user);
            
            const options ={
                expires :new Date(Date.now() + 3 * 24 * 60 * 60* 1000),
                httpOnly:true,   //it will not accessable at client side
            }
            res.cookie("tokenhaibro",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"User logged In Successfully",
            });
        }
        else{
            return res.status(403).json({
                success:false,
                message:"Incorrect Password",
            });
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Login Failure",
        });
    }
}

