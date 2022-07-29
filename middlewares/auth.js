//Imports
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();
 
//Exports
module.exports = (request, response, next) => {
   try {
       const token = request.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET_WORD);
       const userId = decodedToken.userId;
       request.auth = {
           userId: userId,
       };
	next();
   } catch(error) {
        response.status(401).json({ error });
   }
};