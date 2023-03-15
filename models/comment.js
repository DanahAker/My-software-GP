const sequelize=require('sequelize')
const db=require('../db/sequelize').sequelize

const Comment=db.define('Comment',{
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      comment: {
        type: sequelize.STRING
      }
}, {
    createdAt:false,
    updatedAt:false,
    freezeTableName: true,
   
})


module.exports=Comment