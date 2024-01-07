const jwt = require("jsonwebtoken");
const UserModel = require.main.require('./models/user');
const auth = async (req, res, next) => {
    let token = req.headers['authorization'];
    if (!token) {
      return res.status(401).send({
          status: 0,
          token: "Invalid Token"
      });
    }
    token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
        return res.status(403).send({
            status: 0,
            token: "Please login to continue."
        });
    }
    try {
        const token = req.headers["authorization"].replace('Bearer ', '')
        const decoded = jwt.verify(token, secretkeypassword);
        const user = await UserModel.findOne({
            _id: decoded.userId,
        })
        req.user = user;
        if (!user) {
            throw new Error();
        }
    }
    catch (err) {
        return res.status(401).send({
            status: 0,
            token: "Invalid Token"
        });
    }
    return next();
};
module.exports = auth;