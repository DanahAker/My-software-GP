const sequelize=require('sequelize')
const db=require('../db/sequelize').sequelize

const Room=db.define('Room',{
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    senderOneId:{
        type: sequelize.INTEGER
    },
    senderTwoId:{
        type: sequelize.INTEGER
    }
})


module.exports=Room