const sequelize=require('sequelize')
const db=require('../db/sequelize').sequelize

const Ride=db.define('ride', {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    source: {
        type: sequelize.STRING,
        required: true,
    },
    sourceId: {
        type: sequelize.STRING,
        required: true,
    },
    destination: {
        type: sequelize.STRING,
        required: true,
    },
    destinationId: {
        type: sequelize.STRING,
        required: true,
    },
    sourceLatitude: {
        type: sequelize.FLOAT,
    },
    sourceLongitude: {
        type: sequelize.FLOAT,
    },
    destinationLatitude: {
        type: sequelize.FLOAT,
    },
    destinationLongitude: {
        type: sequelize.FLOAT,
    },
    date: {
        type: sequelize.DATEONLY,
        required: true,
    },
    time:{
        type: sequelize.TIME,
        required: true,
    }

  }, {
    createdAt:false,
    updatedAt:false,
   
  })

  module.exports=Ride