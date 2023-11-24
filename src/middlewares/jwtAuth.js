import jwt from 'jsonwebtoken';

// Authentication using token
const jwtAuth = (req, res, next) => {
  const { jwtToken } = req.cookies;

  jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('JWT error: ' + err);
      res.status(401).json({ success: false, msg: 'login to continue' });
    } else {
      const userPayload = decoded;
      req.userId = userPayload.userId;
      next();
    }
  });
};

export default jwtAuth;
