const mongoose =require("mongoose");
require("dotenv").config();

exports.connect =() =>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser :true,
        useUnifiedTopology:true
    })
    .then(() => {console.log("Db connection success")})
    .catch((error) => {
        console.log("Db connection issue ");
        console.error(error);
        process.exit(1);
    });
}