const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    // name:{
    //     type :String,
    //     // required : true
    // },
    // last_name :{
    //     type :String,
    //     // required:true
    // },
    email :{
        type : String,
        required : [true,'Please Enter an email'],
        unique:true,
        lowercase:true,
        validate:[isEmail,'Please Enter a valid email']
    },
    password :{
        type : String,
        required : [true,'Please Enter an Password'],
        minLength:[6,'minimum password length should be 6 charecters']
    },
},{timestamps :true})

// userSchema.post('save',function(doc,next){
//     console.log('new user was created and saved',doc)
//     next();
// })

userSchema.pre('save',async function(next){
    const salt= await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password ,salt)  
    // console.log('new user about to be created and saved',this)
    next();
})

// static method for login user
userSchema.statics.login =async function (email,password) {
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password,user.password);
        if(auth){
            return user;
        }
        throw Error('incorrect Password')
    }
    throw Error('incorrect Email')
}


const User = mongoose.model('auth',userSchema)
module.exports = User;