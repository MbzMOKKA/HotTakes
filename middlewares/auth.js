//Imports
const jwt = require('jsonwebtoken');
 
//Exports
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, 'a651z4875ij416s89t4118864ez19f');
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId,
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};