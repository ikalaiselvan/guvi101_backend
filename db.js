const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config();



const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MongoDB_Url);
        console.log("MongoDB is connected ...")
    }catch(err){
        console.log(err)
    }
}

module.exports = connectDB;