const User = require("../models/authmodel")
const jwt = require("jsonwebtoken");
 
const handleError =(err)=> {
    console.log(err.message,err.code);
    let errors = { email:'',password:'' };

    // incorrect emails
    if(err.message === "incorrect Email"){
        errors.email ="that email is not registered";
    }

    // inorrect password
    if(err.message === "incorrect Password"){
        errors.password = "that password is incorrect";
    }

    // duplicate error code 
    if(err.code === 11000){
        errors.email = 'that email id is already exists'
    }

    // validation errorrs

    if(err.message.includes('auth validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            // console.log(error.properties);
            errors[properties.path] = properties.message;
        })
        // console.log(Object.values(err.errors))
    }

    return errors;
}

// create Token Function
const maxAge = 1 * 24 * 60 *60;
const createToken = (id) =>{
    return jwt.sign({id},'secret Key',{
        expiresIn :maxAge
    });
}


 async function signup_get(req ,res){
    await res.render('signup');
}

async function login_get(req ,res){
    await res.render('login');
}

async function signup_post(req ,res){
    const { name,email,password} = req.body;
    try {
        const user = await User.create({name,email,password});
        // setting the token in the cookie or limited time,
        console.log(user.name)
        const Token = createToken(user._id)
        res.cookie('jwt',Token,{httpOnly:true,maxAge:maxAge*1000});
        console.log('token generated successfully')
        res.status(201).json({user:user._id});
    } catch (err) {
        // console.log(err);
       const errors = handleError(err);
        res.status(400).json({errors});
    }
}

async function login_post(req ,res){
    const { email,password} = req.body;

    try {
        const user = await User.login(email,password);
        const Token = createToken(user._id)
        res.cookie('jwt',Token,{httpOnly:true,maxAge:maxAge*1000});

        res.status(200).json({user : user._id})
    } catch (error) {
        const errors = handleError(error)
        res.status(400).json({errors})
    }
    // console.log(email,password);
    // await res.send('new login');
}

async function logout_get(req ,res){
    res.cookie('jwt',"",{maxAge:1});
    res.redirect('/')
}

module.exports = {
    signup_get,
    login_get,
    signup_post,
    login_post,
    logout_get,
}
