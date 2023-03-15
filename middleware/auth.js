const jwt = require('jsonwebtoken')
const { User, Token } = require('../models/index')
const auth = async (req, res, next) => {
    try {
        
        const token = req.header('Authorization').replace('Bearer ', '')
        
        const decoded = jwt.verify(token, 'thisismygraduationproject')
        console.log(decoded._id)

        const user=await User.findByPk(decoded._id, { include: [{ model: Token, where: {token:token} }] })
        if (!user.tokens.length) {
            throw new Error()
        }
        //console.log(user)
        req.user = user
        req.user.token = token
        req.user.role=user.role
        //req.user.id=user.id
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth