const User = require("../models/User");

// Admin creates user
exports.createUser = async (req,res)=>{
  console.log("the user is ",req.body)
  const { userName,userEmail,userPassword,userRole } = req.body;
  const user = await User.create({ userName,userEmail,userPassword,userRole });
  res.status(201).json({message:"User created", user});
}

// Admin sets permissions
exports.setPermissions = async (req,res)=>{
  const { userId } = req.params;
  const { permissions } = req.body;
  const user = await User.findByIdAndUpdate(userId,{userPermissions:permissions},{new:true});
  if(!user) return res.status(404).json({message:"User not found"});
  res.json({message:"Permissions updated", permissions:user.userPermissions});
}
