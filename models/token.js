const sequelize=require('sequelize')
const db=require('../db/sequelize').sequelize

const Token=db.define('token',{
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
    token: {
        type: sequelize.STRING
      }
}, {
  createdAt:false,
  updatedAt:false,
  hooks: {
    beforeCreate(tokens) {
        tokens.dataValues.id = null
    }
}
})

//Token.sync()

module.exports=Token