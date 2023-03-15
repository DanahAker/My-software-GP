const sequelize=require('sequelize')
const db=require('../db/sequelize').sequelize

const Passenger = db.define('passenger', {      
    id: {
    type: sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  reservedSeats:{
    type: sequelize.INTEGER,

  },
  pending:{
    type:sequelize.BOOLEAN
  }    
    }, { timestamps: false });

module.exports=Passenger