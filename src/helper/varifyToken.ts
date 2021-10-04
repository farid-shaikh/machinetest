const jwt = require('jsonwebtoken');
require('dotenv').config()

module.exports = (req:any, res:any, next:any) => {
    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: "Unauthorized Access." })
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, process.env.JWT_SECRET, (err:any, payload:any) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized Access." })
        }
        req.user = payload
        next()
    })
}