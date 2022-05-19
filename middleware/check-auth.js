const jwt = require("jsonwebtoken");

function authUser  (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "secret_this_should_be_longer")
    req.userData = {email: decodedToken.email, userId: decodedToken.userId};
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth Failed!!!" });
  }
};

function authRole(role){
  return (req,res,next)=>{
    if(req.user.role !== role){
      res.status(401).json({message: 'You are not an Admin'})
    }
    next();
  }
}

module.exports = {
  authUser,
  authRole
}
