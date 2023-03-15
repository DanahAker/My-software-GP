const sequelize=require('sequelize')
const db=require('../db/sequelize').sequelize

const Report=db.define('Report',{
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      reportMessage: {
        type: sequelize.STRING
      }
}, {
    createdAt:false,
    updatedAt:false,
    freezeTableName: true,
   
})


module.exports=Report