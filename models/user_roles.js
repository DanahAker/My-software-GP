const sequelize=require('sequelize')
const db=require('../db/sequelize').sequelize

const user_roles = db.define('user_roles', {      
    id: {
    type: sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }     
    }, { timestamps: false });

module.exports=user_roles