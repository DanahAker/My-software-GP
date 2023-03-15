const request=require('request')

const getDistance =   (place1_id,place2_id) => {

    const url ='https://maps.googleapis.com/maps/api/distancematrix/json?destinations=place_id:'+place2_id+'&origins=place_id:'+place1_id+'&key=AIzaSyDt6jatOcj8_h3mNY2dhJckS7q-6mwGSYA'
    return new Promise( function (resolve, reject) {
     request({ url, json: true },  (error, { body }) => {
        if (error) {
            reject(error);
        } else if (body.error) {
            reject(error);

        } else {
            //const distance=body.rows[0].elements[0].distance.text
             resolve(body.rows[0].elements[0].distance.value);

        }
    })
})
}

module.exports = getDistance