const { Router } = require('express') ;
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const router = Router() ;

const salt = bcrypt.genSaltSync(10);
const secret = process.env.jwtsecret ;

router.post('/register', async (req,res) => {
  const {email,password} = req.body;
  try{
    const userExist = await User.findOne({email});
    if(userExist){
      res.json({msg:'user already exists'});
    }else{
      if(password && password.length<8){
        res.status(400).send("Password is too short");
      } else if(!password) {
        res.status(400).send("Password is required");
      } else{
        const userDoc = await User.create({
          email,
          password:bcrypt.hashSync(password,salt),
        });
        const result =  await userDoc.save();
        res.json(result);
      }
      
    } 
  } catch(e) {
    console.log(e);
    res.status(400).json(e);
  }
});

router.post('/login', async (req,res) => {
  const {email,password} = req.body;
  const userDoc = await User.findOne({email});
  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (passOk) {
    // logged in
    jwt.sign({email,id:userDoc._id}, "shhhh", {expiresIn:"3d"}, (err,token) => {
      if (err) throw err;
      res.cookie('token', token).json({
        msg:"logged in successfully",
        id:userDoc._id,
        email,
        token
      });
    });
    res.header('Access-Control-Allow-Credentials', 'true');

  } else {
    res.json({msg:'wrong credentials'});

  }
});

router.post('/logout', (req,res) => {
  res.cookie('token', '').json('ok');
});


module.exports = router ;
