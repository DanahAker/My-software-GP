const jwt = require('jsonwebtoken')
const User = require('../models/user')

const checkDuplicates  = async (req, res, next) => {
    User.findOne({
        where: {
          username: req.body.username
        }
      }).then(user => {
        if (user) {
          res.status(400).send({
            message: "username is already used"
          });
          return;
        }
    
        // Email
        User.findOne({
          where: {
            email: req.body.email
          }
        }).then(user => {
          if (user) {
            res.status(400).send({
              message: "email is already used"
            });
            return;
          }

        User.findOne({
            where: {mobileNumber: req.body.mobileNumber}
            
        }).then(user=>{
            if (user) {
                res.status(400).send({
                  message: "Phone Number is already used"
                });
                return;
              }
              next();
        })
        });
      });

}

module.exports = checkDuplicates