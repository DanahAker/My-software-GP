const express= require('express')
require('./db/sequelize')
const userRouter = require('./routers/user')
const rideRouter=require('./routers/ride')
const passwordRouter=require('./routers/password')
const adminRouter=require("./routers/admin")
// const http = require('http')
const server = require('socket.io').Server



const app = express()
// const server = http.createServer(app)

const port = 3000

const cors = require("cors");

app.use(cors());
app.options('*',cors)

app.use(express.json())

const {Role,Passenger}=
require("./models/index")
app.use(userRouter)
app.use(rideRouter)
app.use(passwordRouter)
app.use(adminRouter)




// const io = require('socket.io')(http, {
//     cors: {
//         origin: "<http://localhost:3000>"
//     }
// });
const io = new server(4000)

// Role.bulkCreate([{
//     id:1,name: "user"
//   },{
//     id:2,name:"driver"
//   },{
//     id:3,name:"admin"
//   }])



// const server=require('./server')
const getUsers=require('./playground/getUsers')
const { generateMessage, storeMessage,getMessages } = require('./playground/messages')

app.get("/chats/:id", async (req, res) => {
    const chats = await getUsers(req.params.id)
    res.send(chats)
});
io.on('connection', (socket) => {

    socket.on('Chats',async (userId)=>{
        //bring all rooms from db 
        console.log("h")
        socket.emit('chatsList', await getUsers(userId))
    })

    socket.on('findChat',async (ids)=>{
        //bring all messages for this room from db 
        let messages=await getMessages(ids.senderId,ids.receiverId)
        console.log(messages)
        socket.emit('foundChat', messages)
    })

    socket.on('newMessage',async (message) => {
        console.log(message)
        //store message into db
        //const roomId=
        await storeMessage(message.from._id,message.to._id,message.text,Date.now())
        //roomId=from db
        //console.log(roomId)
        let messages=await getMessages(message.from._id,message.to._id)
         socket.broadcast.emit('foundChat', messages)
        socket.emit('chatsList', await getUsers(message.from._id))
    })
})


app.get("/chats/:id", async (req, res) => {
    const chats = await getUsers(req.params.id)
    res.send(chats)
});
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})