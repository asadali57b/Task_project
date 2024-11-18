const mongoose= require("mongoose");
mongoose.connect("mongodb://localhost:27017/ecommerce_user_services").then(() => {
    console.log("Connected to MongoDB");
  }).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const express= require("express");
const startRpcServer=require("./utils/amqServer")
const helmet=require("helmet");
const app = express();
app.use(express.json());
app.use(helmet());

const authRouter=require('./routes/auth_routes')


app.get("/",(req,res)=>{


    res.status(200).json({
        message:"Fetched Succefully"
    })
})
app.use('/',authRouter)
const port=6001;


app.listen(port,async()=>{
  startRpcServer().catch(console.warn);
    console.log(`Server is running on port: ${port}`);
});
