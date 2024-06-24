const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const User = require("../models/authmodel");
const requireAuth = (req,res,next)=>{
    const token  = req.cookies.jwt;
    // check json web token exists and is verified
    if(token){
        console.log("token",token)
        jwt.verify(token,"secret Key",(err , decodedToken)=>{
            if(err){
                console.log(err.message);
                res.redirect('/login');
            }else{
                console.log(decodedToken);
                next();
            }
        })
    }else{
        res.redirect('/login')
    }
}

// check current user
const checkUser = (req,res,next)=>{
    const token = req.cookies.jwt;

    if(token){
        console.log("token",token)
        jwt.verify(token,"secret Key",async(err , decodedToken)=>{
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            }else{
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        })
    }else{
        res.locals.user = null;
        next();
    }

}

module.exports = {
    requireAuth ,checkUser
};