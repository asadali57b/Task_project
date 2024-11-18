const express=require('express');
const proxy=require('express-http-proxy');
const app = express();
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Gatway Server");
})

app.use("/user",proxy("http://localhost:6001"));
app.use("/product",proxy("http://localhost:6000"));

app.listen(5000,()=>{
    console.log("Gatway server running at http://localhost:5000");
})
