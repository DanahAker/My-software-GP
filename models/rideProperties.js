const sequelize=require('sequelize')
const db=require('../db/sequelize').sequelize

const RideProperties=db.define('rideProperties', {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    middleSeatEmpty: {
        type: sequelize.BOOLEAN,
        required: true,
    },
    numberOfPassengers: {
        type: sequelize.INTEGER,
        required: true,
    },
    bookingInstantly:{
        type: sequelize.BOOLEAN,

    },
    // verifiedPhoneNumber:{
    //     type: sequelize.BOOLEAN,

    // },
    AC:{
        type: sequelize.BOOLEAN,
    },
    noSmoking:{
        type: sequelize.BOOLEAN,

    },
    noPets:{
        type: sequelize.BOOLEAN,

    },
    seatForDisabled:{
        type: sequelize.BOOLEAN,

    },
    noChildren:{
        type: sequelize.BOOLEAN,
    },
    girlsOnly:{
        type: sequelize.BOOLEAN,
    },
    guysOnly:{
        type: sequelize.BOOLEAN,
    },
    numberOfAvailableSeats:{
        type: sequelize.INTEGER,
    },
    route:{
        type:sequelize.TEXT
    }


  }, {
    createdAt:false,
    updatedAt:false,
    freezeTableName: true,
    hooks: {
        beforeCreate: async function (rideProperties) {
            //rideProperties.dataValues.bookingInstantly = true,
            rideProperties.dataValues.verifiedPhoneNumber = false

        }
    }
   
  })

  module.exports=RideProperties