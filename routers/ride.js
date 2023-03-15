const express = require('express')
const router = new express.Router()
const { Ride, RideProperties, Passenger, User, pushToken, PushToken } = require('../models/index')
const auth = require('../middleware/auth')
const getLatitude = require('../playground/getLatitude')
const getLongitude = require('../playground/getLongitude')
const { Op } = require("sequelize");
const sequelize = require('sequelize')
const getDistance = require('../playground/getDistance')
const getTime = require('../playground/getTime')
const getRidesIds = require('../playground/getRideIds')
const sendNotification = require('../playground/sendNotifications')
const fs = require("fs");


router.post('/ride/publish', auth, async (req, res) => {
  const rides = await Ride.findAll({ where: { userId: req.user.id, date: req.body.date, time: req.body.time } })
  if (rides.length != 0) {
    res.status(403).send('you have a ride at the same time')
    return
  }
  const ride = new Ride(req.body)
  const userId = req.user.id
  ride.userId = userId
  try {
    ride.sourceLatitude = await getLatitude(req.body.sourceId)
    ride.destinationLatitude = await getLatitude(req.body.destinationId)
    ride.destinationLongitude = await getLongitude(req.body.destinationId)
    ride.sourceLongitude = await getLongitude(req.body.sourceId)

    await ride.save()
    const rideId = ride.id
    const rideProperties = new RideProperties(req.body)
    rideProperties.rideId = rideId
    rideProperties.numberOfAvailableSeats = req.body.numberOfPassengers
    await rideProperties.save()
    res.status(201).send({ ride })
  } catch (e) {
    res.status(400).send(e)
  }

})

router.post('/ride/search', async (req, res) => {

  const distance = await getDistance(req.body.sourceId, req.body.destinationId)
  const time = await getTime(req.body.sourceId, req.body.destinationId)
  let timeAndDistanceData = { "distance": distance, "time": time }
  let [ridesIds, sourcesDistances, destinationsDistances] = await getRidesIds(req.body.sourceId, req.body.destinationId, req.body.date, req.body.range)

  try {


    let rides = await Ride.findAll({
      where: { id: { [Op.in]: ridesIds } },
      attributes: [
        'id', 'source', 'destination', 'time', 'sourceLatitude', 'sourceLongitude', 'destinationLatitude', 'destinationLongitude'
      ],
      include: [
        { model: RideProperties, where: { numberOfAvailableSeats: { [Op.gte]: parseInt(req.body.numberOfPassengers) } } },
        {
          model: User,
          attributes: ['id', 'username'
            , 'profilePicture'
          ]

        },
        {
          model: Passenger, attributes: ['userId']
        }
      ]
    })


    if (rides.length == 0) {
      res.status(404).send("no available rides")
      return
    }
    for (var i = 0; i < rides.length; i++) {
      let passengersIds = []

      let passengers = await Passenger.findAll({ where: { rideId: ridesIds[i] } })
      for (const passenger of passengers) {
        passengersIds.push(passenger.userId)
      }
      for (var j = 0; j < passengersIds.length; j++) {
        const user = await User.findOne({ where: { id: passengersIds[j] } })
        rides[i].passengers[j].setDataValue('name', user.username)
      }
      rides[i].setDataValue('sourcesDistance', sourcesDistances[ridesIds[i]])
      rides[i].setDataValue('destinationsDistance', destinationsDistances[ridesIds[i]])
      rides[i].user['profilePicture'] = fs.readFileSync(rides[i].user['profilePicture'])
    }

    res.send(rides.concat(timeAndDistanceData))
  } catch (e) {
    res.status(400).send(e)
  }

})


// router.post('/ride/reserve',auth,async (req,res)=>{
//   try {    
//     const userId=req.user.id
//     // const rides=await Passenger.findAll({where:{userId}})
//     // if(rides) {
//     // res.status(403).send()
//     // return
//     // }
//     const passengerExists= await Passenger.findOne({where:{userId:userId,rideId:req.body.rideId}})
//     if(passengerExists){
//         res.status(403).send("You have already reserved")
//          return
//     }
//     const passenger=new Passenger({ rideId: req.body.rideId,userId: userId,reservedSeats:req.body.numberOfPassengers  })
//     await passenger.save()
//     const rideProperties=await RideProperties.findOne({where:{rideId:req.body.rideId}})
//     RideProperties.update({ numberOfAvailableSeats: rideProperties.numberOfAvailableSeats-parseInt(req.body.numberOfPassengers)},{where:{rideId:req.body.rideId}})

//     const ride=await Ride.findOne({where:{id:req.body.rideId}})
//     const pushTokensOb=await PushToken.findAll({where:{userId:ride.userId}})
//     const pushTokens=[]
//     for (const token of pushTokensOb){
//         pushTokens.push(token.token)
//     }
//     await sendNotification(pushTokens,"A passenger has reserverd in your ride")

//     res.status(200).send('Reserved successfully')
//   } catch (e) {
//       res.status(400).send(e)
//   }

//   })


router.post('/ride/reserve', auth, async (req, res) => {
  try {
    const userId = req.user.id
    const rideId = req.body.rideId
    const passengerExists = await Passenger.findOne({ where: { userId, rideId } })
    if (passengerExists) {
      res.status(403).send("You have already reserved")
      return
    }
    const rideProperties = await RideProperties.findOne({ where: { rideId } })
    if (rideProperties.bookingInstantly) {
      // const rides=await Passenger.findAll({where:{userId}})
      // if(rides) {
      // res.status(403).send()
      // return
      // }

      const passenger = new Passenger({ rideId: req.body.rideId, userId: userId, reservedSeats: req.body.numberOfPassengers, pending: false })
      await passenger.save()
      //const rideProperties = await RideProperties.findOne({ where: { rideId: req.body.rideId } })
      RideProperties.update({ numberOfAvailableSeats: rideProperties.numberOfAvailableSeats - parseInt(req.body.numberOfPassengers) }, { where: { rideId: req.body.rideId } })

      const ride = await Ride.findOne({ where: { id: req.body.rideId } })
      const pushTokensOb = await PushToken.findAll({ where: { userId: ride.userId } })
      const pushTokens = []
      for (const token of pushTokensOb) {
        pushTokens.push(token.token)
      }
      await sendNotification(pushTokens, "A passenger has reserverd in your ride")

      res.status(200).send()
      return
    }
    const passenger = new Passenger({ rideId: req.body.rideId, userId: userId, reservedSeats: req.body.numberOfPassengers, pending: true })
    await passenger.save()
    const ride = await Ride.findOne({ where: { id: req.body.rideId } })
    const pushTokensOb = await PushToken.findAll({ where: { userId: ride.userId } })
    const pushTokens = []
    for (const token of pushTokensOb) {
      pushTokens.push(token.token)
    }
    await sendNotification(pushTokens, "A passenger has requested to reserve in your ride")
    res.status(200).send()

  } catch (e) {
    res.status(400).send(e)
  }

})

router.delete('/ride/delete/:rideId', auth, async (req, res) => {


  const userId = req.user.id
  const rideId = req.params.rideId
  try {
    const driver = await Ride.findOne({ where: { id: rideId, userId } })

    if (!driver) {
      const passenger = await Passenger.findOne({ where: { rideId, userId } })
      const numberOfReservedSeats = passenger.reservedSeats
      await Passenger.destroy({ where: { rideId, userId } })
      const rideProperties = await RideProperties.findOne({ where: { rideId } })
      RideProperties.update({ numberOfAvailableSeats: rideProperties.numberOfAvailableSeats + numberOfReservedSeats }, { where: { rideId } })
      const ride = await Ride.findOne({ where: { id: rideId } })
      const pushTokensOb = await PushToken.findAll({ where: { userId: ride.userId } })
      const pushTokens = []
      for (const token of pushTokensOb) {
        pushTokens.push(token.token)
      }
      await sendNotification(pushTokens, "A passenger has cancelled their reservation")
      res.status(200).send('Ride deleted successfully')

      return
    }

    const passengers = await Passenger.findAll({ where: { rideId } })
    const passengersIds = []
    for (const passenger of passengers) {
      passengersIds.push(passenger.userId)
    }
    const pushTokensOb = await PushToken.findAll({ where: { userId: { [Op.in]: passengersIds } } })
    const pushTokens = []
    for (const token of pushTokensOb) {
      pushTokens.push(token.token)
    }
    await sendNotification(pushTokens, "A drive has been cancelled")

    await Passenger.destroy({ where: { rideId } })
    await RideProperties.destroy({ where: { rideId } })
    await Ride.destroy({ where: { id: rideId } })
    res.status(200).send('Ride deleted successfully')
    return



  } catch (e) {
    res.status(400).send(e)
  }

})

router.get('/myRides', auth, async (req, res) => {

  try {
    const userId = req.user.id
    let role = req.user.role
    let rides = []
    let ridesIds = []
    let passengers = await Passenger.findAll({ where: { userId, pending: 0 }, attributes: ['rideId'] })
    for (const passenger of passengers) {
      ridesIds.push(passenger.rideId)
    }
    const passengerRides = await Ride.findAll({
      where: { id: { [Op.in]: ridesIds } },
      include: [{ model: Passenger, attributes: ['userId','pending'] }, { model: User, attributes: ['id', 'username', 'profilePicture'] }, { model: RideProperties }]
    })
    for (var i = 0; i < passengerRides.length; i++) {
      let passengersIds = []
      let passengers = await Passenger.findAll({ where: { rideId: passengerRides[i].id } })
      for (const passenger of passengers) {
        passengersIds.push(passenger.userId)
      }

      for (var j = 0; j < passengersIds.length; j++) {
        const user = await User.findOne({ where: { id: passengersIds[j] } })
        passengerRides[i].passengers[j].setDataValue('name', user.username)
      }

      passengerRides[i].user['profilePicture'] = fs.readFileSync(passengerRides[i].user['profilePicture'])
    }
    if (role == 'driver') {

      rides = await Ride.findAll({ where: { userId }, include: [{ model: RideProperties }, { model: Passenger, attributes: ['userId', 'pending'] }, { model: User, attributes: ['id', 'username', 'profilePicture'] }] })

      for (var i = 0; i < rides.length; i++) {
        let passengersIds = []
        let passengers = await Passenger.findAll({ where: { rideId: rides[i].id } })
        for (const passenger of passengers) {
          passengersIds.push(passenger.userId)
        }

        for (var j = 0; j < passengersIds.length; j++) {
          const user = await User.findOne({ where: { id: passengersIds[j] } })
          rides[i].passengers[j].setDataValue('name', user.username)
          //rides[i].passengers[j]['name']=user.username
        }

        rides[i].user['profilePicture'] = fs.readFileSync(rides[i].user['profilePicture'])
      }

    }
    res.send({ 'asPassenger': passengerRides, 'asDriver': rides })

  } catch (e) {
    res.status(400).send(e)
  }

})

router.get('/publish/role', auth, async (req, res) => {

  try {

    let role = req.user.role
    res.send(role)
  } catch (e) {
    res.status(400).send(e)
  }

})

router.get('/rides/Requests', auth, async (req, res) => {

  try {
    const userId = req.user.id
    let requests = await Ride.findAll({
      where: {
        userId
      },
      attributes: ['id', 'destination', 'source'],
      include: [{
        model: Passenger,
        as: 'passengers',
        where: {
          pending: true
        }
      }]
    })
    for (var i = 0; i < requests.length; i++) {
      let passengersIds = []
      let passengers = await Passenger.findAll({ where: { rideId: requests[i].id, pending:1} })
      for (const passenger of passengers) {
        passengersIds.push(passenger.userId)
      }

      for (var j = 0; j < passengersIds.length; j++) {
        const user = await User.findOne({ where: { id: passengersIds[j] } })
        requests[i].passengers[j].setDataValue('name', user.username)
        requests[i].passengers[j].setDataValue('profilePicture', fs.readFileSync(user['profilePicture']))
      }

    }
    res.send(requests)
  } catch (e) {
    res.status(400).send(e)
  }

})



router.post('/ride/requests/deny', auth, async (req, res) => {
  const userId = req.body.passengerId
  const rideId = req.body.rideId
  try {
    await Passenger.destroy({ where: { rideId, userId } })
    const pushTokensOb = await PushToken.findAll({ where: { userId } })
    const pushTokens = []
    for (const token of pushTokensOb) {
      pushTokens.push(token.token)
    }
    await sendNotification(pushTokens, "A driver has denied your request")
    res.status(200).send('Ride deleted successfully')

  } catch (e) {
    res.status(400).send(e)
  }

})


router.post('/ride/requests/accept',auth,async (req,res)=>{
  const userId = req.body.passengerId
  const rideId = req.body.rideId

  try {

      await Passenger.update({ pending: false},{where:{rideId, userId }})
      const passenger = await Passenger.findOne({ where: { userId, rideId } })
      const rideProperties = await RideProperties.findOne({ where: { rideId } })

      RideProperties.update({ numberOfAvailableSeats: rideProperties.numberOfAvailableSeats - parseInt(passenger.reservedSeats) }, { where: { rideId } })
      const pushTokensOb = await PushToken.findAll({ where: { userId } })
      const pushTokens = []
      for (const token of pushTokensOb) {
        pushTokens.push(token.token)
      }
      await sendNotification(pushTokens, "A driver has accepted your sequest")

      res.send()
  } catch (e) {
      res.status(400).send(e)
  }
    
})



module.exports = router
