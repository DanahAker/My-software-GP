const express=require('express')
const router=new express.Router()
const { User, Token} = require('../models/index')


router.post("/:userId/:token", async (req, res) => {
    
    try {
        const user=await User.findByPk(req.params.userId, { include: [{ model: Token, where: {token:req.params.token} }] })
        
        if (!user)  
        {
            console.log("no user")
            res.status(400).send("invalid link") 
        return;
            }

        await User.update({ password: req.body.password},{where:{id:req.params.userId}})

        Token.destroy({
            where: {token:req.params.token},
          })

        res.send("password is reset sucessfully.");
    } catch (error) {
        res.status(400).send(error)
    }
});


module.exports=router