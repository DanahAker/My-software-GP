const sequelize=require('sequelize')
const db=require('../db/sequelize').sequelize

const DriverData=db.define('DriverData',{
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      drivingLicense: {
        type: sequelize.BLOB("long"),
      },
      carLicense: {
        type: sequelize.BLOB("long"),
      },
      carInsurance: {
        type: sequelize.BLOB("long"),
      }
}, {
    createdAt:false,
    updatedAt:false,
    freezeTableName: true,
    hooks: {
      beforeCreate(data) {
          //data.dataValues.drivingLicense = null,
          //data.dataValues.carLicense = null,
          //data.dataValues.carInsurance = null
      }
  }
})


module.exports=DriverData