const { Message, Room, User } = require('../models/index')
const { Op } = require('sequelize')
const generateMessage = (senderId, text) => {
    return {
        senderId,
        text,
        //createdAt: new Date().getTime()
    }
}

const storeMessage = async (senderId, receiverId, text, date) => {
    const roomId = await Room.findOne({
        where: {
            [Op.or]: [{ senderOneId: senderId, senderTwoId: receiverId },
            { senderOneId: receiverId, senderTwoId: senderId }]
        }, attributes: ['id']
    })
    let roomId1
    //console.log('room:')
    //console.log(roomId1)
    if (!roomId) {
        const room = new Room({ senderOneId:senderId, senderTwoId:receiverId })
        await room.save()
        roomId1 = room.id
        console.log(room.id)

        // await Room.create({senderId,receiverId})
    }
    else roomId1=roomId.id
    //console.log(roomId1)
    await Message.create({ senderId, receiverId, text, date,roomId:roomId1 })

    
    //return roomId1
}

const getMessages = async (senderId, receiverId) => {
    let messages = await Message.findAll({
        where: {
            [Op.or]: [{ senderId, receiverId },
            { senderId: receiverId, receiverId: senderId }]
       }, order: [['createdAt', 'DESC']] 
    })

    
    for (var i = 0; i < messages.length; i++) {
        messages[i].setDataValue('user', { "_id": messages[i].senderId })
        messages[i].setDataValue('to', { "_id": messages[i].receiverId})
    }
    return messages
}
module.exports = {
    generateMessage,
    storeMessage,
    getMessages
}