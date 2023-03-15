const User = require("../models/user.js")
const Token=require('../models/token.js')
const Role=require('../models/role.js')
const DriverData=require('../models/driverData.js')
const Ride=require("../models/ride.js")
const RideProperties=require("../models/rideProperties.js")
const user_roles=require("../models/user_roles.js")
const Passenger=require("../models/passenger.js")
const Comment=require("../models/comment.js")
const PushToken=require("../models/pushToken.js")
const Message=require("../models/message.js")
const Room=require("../models/room.js")
const Report=require("../models/report.js")
const db=require('../db/sequelize').sequelize
const sequelize=require('sequelize')

// const user_roles = db.define('user_roles', {      
//   id: {
//   type: sequelize.INTEGER,
//   autoIncrement: true,
//   primaryKey: true
// }     
//   }, { timestamps: false });

//user-token relationship
User.hasMany(Token)
Token.belongsTo(User, {
    foreignKey: "userId"
})


//user-driverdata relationship
DriverData.belongsTo(User, {
    foreignKey: "userId"
})

//user-ride relationship
User.hasMany(Ride)
Ride.belongsTo(User, {
  foreignKey: "userId"
})

Ride.hasOne(RideProperties)
RideProperties.belongsTo(Ride, {
  foreignKey: "rideId"
})

//user-role relationship
Role.belongsToMany(User, {
  through: "user_roles",
});
User.belongsToMany(Role, {
  through: "user_roles",

});

//passenger with driver and ride relationship
User.hasMany(Passenger)
Passenger.belongsTo(User, {
  foreignKey: "userId"
});

Ride.hasMany(Passenger)
Passenger.belongsTo(Ride, {
  foreignKey: "rideId",

})

User.hasMany(Comment)
Comment.belongsTo(User, {
    foreignKey: "userId" ,
    foreignKey: "commentToId"
});

User.hasMany(Report)
Report.belongsTo(User, {
    foreignKey: "userId" ,
    foreignKey: "reportToId"
})

//user-pushToken relationship
User.hasMany(PushToken)
PushToken.belongsTo(User, {
    foreignKey: "userId"
})

const syncModels=async()=>{
  await User.sync()
  await Role.sync()
  await Token.sync()
  await Ride.sync()
  await DriverData.sync()
  await RideProperties.sync()
  await user_roles.sync()
  await Passenger.sync()
  await Comment.sync()
  await PushToken.sync()
  await Message.sync()
  await Room.sync()
  await Report.sync()
}
syncModels()

module.exports = {User, Token,Role,DriverData,Ride,RideProperties,user_roles,Passenger,Comment,PushToken,Message,Room,Report};