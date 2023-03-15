const getDistance=require('./getDistance')
const { Ride } = require('../models/index')



async function getRidesIds (sourceIdFromUser,destinationIdFromUser,date,range) {
    let ids=[]
let sourcesDistances=[]
let destinationsDistances=[]

let ridesDistances1={}
let ridesDistances2={}
    let ridesArray=await Ride.findAll({where:{date}})

    for (const ride of ridesArray){
        const sourcesDistance=await getDistance(sourceIdFromUser,ride.sourceId)
        const destinationsDistance=await getDistance(destinationIdFromUser,ride.destinationId)
        if(sourcesDistance<= range && destinationsDistance<=range ){    
            ids.push(ride.id)
            sourcesDistances.push(sourcesDistance)
            destinationsDistances.push(destinationsDistance)

        }
    }

    ids.forEach((Curr_element, index) => { 
        ridesDistances1[Curr_element] = sourcesDistances[index]
        ridesDistances2[Curr_element] = destinationsDistances[index]
    }) 
   

return [ids,ridesDistances1,ridesDistances2]
}

module.exports = getRidesIds