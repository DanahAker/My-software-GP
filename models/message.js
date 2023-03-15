const sequelize=require('sequelize')
const db=require('../db/sequelize').sequelize

const Message=db.define('Message',{
    _id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      text: {
        type: sequelize.STRING
      },
      senderId:{
        type: sequelize.INTEGER
      },
      receiverId:{
        type: sequelize.INTEGER
      },
      date:{
        type:sequelize.DATE
      },
      roomId:{
        type:sequelize.INTEGER
      }
})


module.exports=Message