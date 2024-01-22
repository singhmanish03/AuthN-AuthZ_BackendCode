const express = require("express");
const app =express();

//port find kiye 
require('dotenv').config();
const PORT =process.env.PORT || 4000;

//middle ware dale for parsing
//cookie parser adding
const cookieParser =require("cookie-parser");
app.use(cookieParser());
app.use(express.json());

//database connect kijye
require("./config/database").connect();

//route import and mount
const user=require("./routes/user");
app.use("/api/v1",user);

//activate the server
app.listen(PORT,() => {
    console.log(`App is ruuning at ${PORT}`);
})

//default routes

app.get("/" ,(req,res) =>{
    res.send(`<h1> Hai how are you You are on ${PORT} port </h1> `)
})
