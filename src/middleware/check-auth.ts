import jwt from 'jsonwebtoken';

export function authUser(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Auth Failed!!!' });
  }
}

export function authRole(role) {
  return (req, res, next) => {
    console.error(req);
    if (req.user.role !== role) {
      res.status(401).json({ message: 'You are not an Admin' });
    }
    next();
  };
}
