const User = require("../models/User");
const jwt =require('jsonwebtoken');
//handel errors
const handelErrors= (err) => {
    console.log(err.message ,err.code);
    let errors ={email : '', password : ''};

    
    //duplicate regisered
    if (err.code === 11000){
        errors.email = 'that email is alredy registered';
        return errors;
    }

     //validation errors
    if (err.message.includes('user validatin failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path]=properties.message;
        });
    }
    return errors;
}
const maxage = 60*60*24*3;
const createtoken =(id)=>{
    return jwt.sign({id},'omar ahamed saeed',{
        expiresIn:maxage
    });
}


module.exports.signup_get = (req , res )=>{
    res.render('signup');
}
module.exports.login_get = (req , res )=>{
    res.render('login');
}
module.exports.signup_post = async(req , res )=>{
    const {email,password}=req.body;
    try{
        const user=await User.create({email,password});
        const token =createtoken(user._id);
        res.cookie('jwt',token,{ httpOnly: true,maxage:maxage *1000});
        res.status(201).json({user: user._id});
    }
    catch (err){
        const errors =handelErrors(err);
        res.status(400).json({errors});
        
    }
}
module.exports.login_post = (req , res )=>{
    const { email , password}=req.body;
    console.log(email,password);

    res.send('new login');
}
