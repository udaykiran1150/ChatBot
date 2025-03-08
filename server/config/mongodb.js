import mongoose from "mongoose";

const connectDb=async()=>
{  
    mongoose.connection.on('connected',()=>console.log("DataBase is Connected"))
    
    await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`)
}
export default connectDb; 