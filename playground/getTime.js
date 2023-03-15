const request=require('request')

const getTime =   (place1_id,place2_id) => {
        const url ='https://maps.googleapis.com/maps/api/distancematrix/json?destinations=place_id:'+place2_id+'&origins=place_id:'+place1_id+'&key='
    return new Promise( function (resolve, reject) {
     request({ url, json: true },  (error, { body }) => {
        if (error) {
            reject(error);
        } else if (body.error) {
            reject(error);

        } else {
             resolve(body.rows[0].elements[0].duration.text);

        }
    })
})
}

module.exports = getTime