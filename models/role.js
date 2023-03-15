const sequelize=require('sequelize')
const db=require('../db/sequelize').sequelize

const Role=db.define('role',{
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: sequelize.STRING
      }
}, {
  createdAt:false,
  updatedAt:false,
})


module.exports=Role
