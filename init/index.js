require('dotenv').config();
const mongodb =require('mongoose');
const samdata = require('./samplelist.js');
const listing =require('../models/listing.js');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapboxToken = process.env.MAP_BOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken});


async function main() {
    await mongodb.connect('mongodb://localhost:27017/wanderlust');
    
}
main().then(()=>{
    console.log('successfully connected')
}).catch((err)=> console.log(err));


const initdb= async() =>{
    await listing.deleteMany({});
    for ( let el of samdata.data){
    let response = await geocodingClient.forwardGeocode({
  query: el.location, // Use the location from the form
  limit: 1
})
  .send();
  el.owner='689869c2e8f080654ca5f9ee';
  el.geometry=response.body.features[0].geometry;
    // samdata.data = samdata.data.map((el) => ({...el,owner:'689869c2e8f080654ca5f9ee',geometry: response.body.features[0].geometry}));
}
    console.log(samdata.data);

    await listing.insertMany(samdata.data);
    console.log('data is sended');
}

initdb();