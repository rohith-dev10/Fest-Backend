var jwt = require('jsonwebtoken');
const JWT_TOKEN  = "iiitv-icd";


const fetchuser = (req, res, next) => {
    // Get the user from the jwt token and add id to req object
    const token = req.header('auth-token');

    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const rawdata = jwt.verify(token,JWT_TOKEN);
        req.user = rawdata.user;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }

}


module.exports = fetchuser;