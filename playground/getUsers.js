
const { Message, Room, User } = require('../models/index')
const { Op } = require("sequelize");
const fs = require("fs");

const getUsers = async (id) => {
    const sendersIds = []
    const rooms = await Room.findAll({ where: { [Op.or]: [{ senderOneId: id }, { senderTwoId: id }] } })
    for (const room of rooms) {
        if (room.senderOneId == id) {
            sendersIds.push(room.senderTwoId)
        }
        else sendersIds.push(room.senderOneId)
    }

    const users = await User.findAll({ where: { id: { [Op.in]: sendersIds } }, attributes: ['id', 'username','profilePicture'] })
    const allChats = []
    for (var i = 0; i < users.length; i++) {
        allChats[i] = { "id": `${rooms[i].id}`}
        allChats[i]['chatter'] = users[i]
        allChats[i].chatter['profilePicture']=fs.readFileSync(allChats[i].chatter['profilePicture'])
        let message=await Message.findOne({where:{[Op.or]: [{ senderId: id,receiverId:users[i].id}, { receiverId: id,senderId: users[i].id}]},
            order: [ [ 'createdAt', 'DESC' ]],attributes:['text','createdAt']})

        allChats[i]['lastMessage']=message
    }
    return allChats
}

module.exports = getUsers