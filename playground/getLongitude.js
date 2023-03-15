const request=require('request')

const getLongitude =   (placeId) => {
    const url = 'https://maps.googleapis.com/maps/api/place/details/json?fields=geometry&place_id='+placeId+'&key='
    //'https://api.darksky.net/forecast/9d1465c6f3bb7a6c71944bdd8548d026/' + latitude + ',' + longitude

    return new Promise( function (resolve, reject) {
     request({ url, json: true },  (error, { body }) => {
        if (error) {
            reject(error);
        } else if (body.error) {
            reject(error);

        } else {

             resolve(body.result.geometry.location.lng);

        }
    })
})
}

module.exports = getLongitude