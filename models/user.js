const sequelize=require('sequelize')
const db=require('../db/sequelize').sequelize
const jwt = require('jsonwebtoken')
const Token = require('./token')
//const {  user_roles} = require('../models/index')
const user_roles=require("../models/user_roles.js")
const Role=require("../models/role")
const path=require('path')
const filePath=path.join(__dirname, "../files/uploads/profilePicture.webp")
console.log(filePath)
//let numberOfRates=0
const fs = require("fs");




const User=db.define('user', {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: sequelize.STRING,
        unique: true,
        required: true,
    },
    email: {
        type: sequelize.STRING,
        unique: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: sequelize.STRING,
        required: true,
    },
    mobileNumber:{
        type: sequelize.INTEGER,
        unique: true,
    },
    profilePicture:{
        type: sequelize.BLOB("long"),
        // get(){
        //     const ppURL=this.getDataValue('profilePicture')
        //     console.log("inside get function")
        //     return fs.readFileSync(ppURL)
        // }
    },
    role:{
        type: sequelize.STRING,
        required: true,
    },
    gender:{
        type: sequelize.STRING

    },
    bio:{
        type: sequelize.STRING
    },
    rating:{
        type: sequelize.DOUBLE
    },
    dateOfBirth:{
        type: sequelize.DATEONLY
    },
    emailToken:{        
        type: sequelize.STRING
    },
    verifiedEmail:{
        type: sequelize.BOOLEAN
    },
    numberOfRates:{
        type: sequelize.INTEGER,

    },
    pending:{
        type:sequelize.BOOLEAN
    }


  }, {
    createdAt:false,
    updatedAt:false,
    //freezeTableName: true,
    hooks: {
        beforeCreate: async function (user) {
            user.dataValues.id = null
            // user.dataValues.gender=null
            user.dataValues.bio=null
            user.dataValues.rating=0
            user.dataValues.verifiedEmail=false
            user.dataValues.emailToken = null
            user.dataValues.numberOfRates = 0
            user.dataValues.pending=false
            // user.dataValues.profilePicture=fs.readFileSync(filePath)
            user.dataValues.profilePicture=filePath

          
        }
    }
  })


sequelize.Model.findByCredentials = async (username,password) =>{
    const user = await User.findOne({where:{ username }})

    if (!user) {
        throw new Error('Unable to login')
    }

    // const isMatch = await bcrypt.compare(password, user.password)
    const isMatch=password=== user.password

    if (!isMatch) {
        throw new Error('Unable to login')
    }

    return user
}

sequelize.Model.prototype.generateAuthToken = async function(){
    const user=this
    const token=jwt.sign({ _id: user.id.toString() }, 'thisismygraduationproject')
    await user.save()
    //await user.addToken(token,user.id)
    const userToken = new Token({ token,userId: user.id  })
    await userToken.save()
    return token

}

sequelize.Model.prototype.generateRole=async function(role){
    const user=this
    const userId=user.id
    const roledata=await Role.findOne({where:{name:role}})
    console.log(roledata.id)
    const UserRoles=await user_roles.create({userId:userId,roleId:roledata.id})

    await UserRoles.save()
    return
}

// sequelize.Model.Rate = async function(id,newRate){
//     const user=await User.findOne({where:{id}})
//     if(!user){
//         return "No such User"
//     }

//     const previousRating=user.rating
//     let newRating=parseFloat((previousRating*numberOfRates)+newRate)/(user.numberOfRates+1)
//     console.log(newRate)
//     await User.update({ rating:newRating,numberOfRates:numberOfRates+1},{where:{id}})
//     console.log(user.numberOfRates)
//     user.numberOfRates++


// }


//User.sync()


module.exports = User
