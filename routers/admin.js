const express = require('express')
const { Report, User, Token, PushToken, Comment, Message, Passenger, Room, Ride, RideProperties, DriverData } = require('../models')
const router = new express.Router()
const auth = require('../middleware/auth')
const fs = require("fs");
const { Op } = require("sequelize");
const Sequelize = require('sequelize')
const sequelize = require('../db/sequelize').sequelize
const { QueryTypes } = require('sequelize');


router.get('/admin/reports', auth, async (req, res) => {
    try {
        let reportFromIds = []
        let reportToIds = []
        let reports = await Report.findAll()
        for (const report of reports) {
            reportFromIds.push(report.userId)
            reportToIds.push(report.reportToId)
        }

        for (var j = 0; j < reports.length; j++) {
            const reportFromData = await User.findOne({ where: { id: reportFromIds[j] } })
            reportFromData['profilePicture'] = fs.readFileSync(reportFromData['profilePicture'])

            const reportToData = await User.findOne({ where: { id: reportToIds[j] } })
            reportToData['profilePicture'] = fs.readFileSync(reportToData['profilePicture'])

            reports[j].setDataValue('reportFrom', reportFromData)
            reports[j].setDataValue('reportTo', reportToData)

        }

        res.send(reports)
    } catch (e) {
        res.status(400).send(e)
    }

})


router.delete('/admin/deleteAccount/:id', auth, async (req, res) => {
    try {
        await Token.destroy({ where: { userId: req.params.id } })
        await PushToken.destroy({ where: { userId: req.params.id } })
        await Report.destroy({ where: { [Op.or]: [{ userId: req.params.id }, { reportToId: req.params.id }] } })
        await Comment.destroy({ where: { [Op.or]: [{ userId: req.params.id }, { commentToId: req.params.id }] } })
        await Message.destroy({ where: { [Op.or]: [{ senderId: req.params.id }, { receiverId: req.params.id }] } })
        await Passenger.destroy({ where: { userId: req.params.id } })
        await Room.destroy({ where: { [Op.or]: [{ senderOneId: req.params.id }, { senderTwoId: req.params.id }] } })
        let rides = await Ride.findAll({ where: { userId: req.params.id } })
        await Ride.destroy({ where: { userId: req.params.id } })
        if (rides) {
            let ridesIds = []
            for (const ride of rides) {
                ridesIds.push(ride.id)
            }
            await RideProperties.destroy({ where: { id: { [Op.in]: ridesIds } } })
        }

        await DriverData.destroy({ where: { userId: req.params.id } })
        await User.destroy({ where: { id: req.params.id } })


        res.send()
    } catch (e) {
        res.status(500).send()
    }
})


router.delete('/admin/ignoreReport/:id', auth, async (req, res) => {
    try {
        await Report.destroy({ where: { id: req.params.id } })
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/admin/requests', auth, async (req, res) => {
    try {

        let requests = await User.findAll({ where: { pending: true } })
        res.send(requests)
    } catch (e) {
        res.status(400).send(e)
    }

})

router.get('/admin/drivingLicense/:id', auth, async (req, res) => {

    try {
        let drivingLicense = await DriverData.findOne({ where: { userId: req.params.id }, attributes: ['drivingLicense'] })
        drivingLicense['drivingLicense'] = fs.readFileSync(drivingLicense['drivingLicense'])

        res.send(drivingLicense)
    } catch (e) {
        res.status(400).send(e)
    }

})

router.get('/admin/carLicense/:id', auth, async (req, res) => {
    try {

        let carLicense = await DriverData.findOne({ where: { userId: req.params.id }, attributes: ['carLicense'] })
        carLicense['carLicense'] = fs.readFileSync(carLicense['carLicense'])

        res.send(carLicense)
    } catch (e) {
        res.status(400).send(e)
    }

})

router.get('/admin/carInsurance/:id', auth, async (req, res) => {
    try {

        let carInsurance = await DriverData.findOne({ where: { userId: req.params.id }, attributes: ['carInsurance'] })
        carInsurance['carInsurance'] = fs.readFileSync(carInsurance['carInsurance'])

        res.send(carInsurance)
    } catch (e) {
        res.status(400).send(e)
    }

})


router.post('/admin/requests/accept/:id', auth, async (req, res) => {
    try {

        await User.update({ pending: false, role: 'driver' }, { where: { id: req.params.id } })

        res.send()
    } catch (e) {
        res.status(400).send(e)
    }

})

router.post('/admin/requests/deny/:id', auth, async (req, res) => {
    try {

        await User.update({ pending: false }, { where: { id: req.params.id } })
        await DriverData.destroy({ where: { userId: req.params.id } })
        res.send()
    } catch (e) {
        res.status(400).send(e)
    }

})

router.get('/admin/passengers', auth, async (req, res) => {
    try {

        let users = await User.findAll({
            where: { role: 'user' }, attributes: { exclude: ['password'] }
        })
        for (var j = 0; j < users.length; j++) {
            let numOfReports = await Report.count({ where: { reportToId: users[j].id } })
            users[j].setDataValue('numOfReports', numOfReports)

        }

        res.send(users)
    } catch (e) {
        res.status(400).send(e)
    }

})

router.get('/admin/drivers', auth, async (req, res) => {
    try {

        let users = await User.findAll({ where: { role: 'driver' }, attributes: { exclude: ['password'] } })
        for (var j = 0; j < users.length; j++) {
            let numOfReports = await Report.count({ where: { reportToId: users[j].id } })
            users[j].setDataValue('numOfReports', numOfReports)
        }
        res.send(users)
    } catch (e) {
        res.status(400).send(e)
    }

})

router.get('/admin/statistics/genderPercentage', auth, async (req, res) => {
    try {

        let numOfMales = await User.count({ where: { gender: 'male' } })
        let numOfFemales = await User.count({ where: { gender: 'female' } })

        res.send({ 'numOfMales': numOfMales, 'numOfFemales': numOfFemales })
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }

})


router.get('/admin/statistics/passengersToDriversPercentage', auth, async (req, res) => {
    try {

        let numOfPassengers = await User.count({ where: { role: 'user' } })
        let numOfDrivers = await User.count({ where: { role: 'driver' } })

        res.send({ 'numOfPassengers': numOfPassengers, 'numOfDrivers': numOfDrivers })
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }

})


router.get('/admin/statistics/ridesPerMonth', auth, async (req, res) => {
    try {
        console.log("rides per month")


        let ridesPerMonth = new Array(12).fill(0);

        await sequelize.query(`
        SELECT
        MONTH(date) as month,
        COUNT(*) as ride_count
        FROM rides
        GROUP BY MONTH(date)
        `, { type: Sequelize.QueryTypes.SELECT })
            .then(results => {
                results.forEach(result => {
                    ridesPerMonth[result.month - 1] = result.ride_count;
                });
            });

        res.send(ridesPerMonth)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }

})

router.patch('/admin/profileEdit', auth, async (req, res) => {
    const id = req.user.id
    try {
        const user = await User.findOne({ where: { id } })
        await User.update({
            password: req.body.password,
            username: req.body.username,
            email: req.body.email,
            dateOfBirth: req.body.dateOfBirth,
            mobileNumber: req.body.mobileNumber
        }, { where: { id } })
        res.status(200).send("updated succesfully")
    } catch (e) {
        res.status(400).send()
    }
})
module.exports = router
