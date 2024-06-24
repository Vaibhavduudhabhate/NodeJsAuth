const express = require("express");
const mongoose = require("mongoose");
const app = express();
const authRoutes = require('./routes/allroutes');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require("./middleware/authMiddleware");
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.set("view engine",'ejs');

app.get('*',checkUser)
app.get('/', (req, res) => {
    res.render('home');
  });
app.get('/dummy',requireAuth, (req, res) => {
    res.render('dashboard');
  });
app.use(authRoutes) 


// cookies section
// app.get('/set-cookies',(req,res)=>{
//     res.cookie('newUser',false);
//     res.cookie('isEmploye',true ,{maxAge :1000 *60 *60 *24 ,httpOnly:true})
//     res.send('you got the cookies');
// })
// app.get('/read-cookies',(req,res)=>{    
//     const cookies = req.cookies;
//     console.log(cookies.newUser);
//     res.json(cookies)
// })


// database connection
async function connectMongoDb(url){
    return mongoose.connect(url)
}
connectMongoDb('mongodb+srv://admin:admin1234@cluster0.w3huoar.mongodb.net/practiceDatabase').then(()=>console.log("mongodb connected"))

module.exports ={
    connectMongoDb,
}

app.listen(PORT ,()=>console.log(`server started at PORT ${PORT}`))