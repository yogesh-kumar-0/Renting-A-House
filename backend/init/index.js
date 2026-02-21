// require('dotenv').config();
// const mongodb =require('mongoose');
// const samdata = require('./samplelist.js');
// const listing =require('../models/listing.js');

// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapboxToken = process.env.MAP_BOX_TOKEN;
// const geocodingClient = mbxGeocoding({ accessToken: mapboxToken});


// async function main() {
//     await mongodb.connect('mongodb://localhost:27017/rent-a-house');
    
// }
// main().then(()=>{
//     console.log('successfully connected')
// }).catch((err)=> console.log(err));


// const initdb= async() =>{
//     await listing.deleteMany({});
//     for ( let el of samdata.data){
//     let response = await geocodingClient.forwardGeocode({
//   query: el.location, // Use the location from the form
//   limit: 1
// })
//   .send();
//   el.owner='689869c2e8f080654ca5f9ee';
//   el.geometry=response.body.features[0].geometry;
//     // samdata.data = samdata.data.map((el) => ({...el,owner:'689869c2e8f080654ca5f9ee',geometry: response.body.features[0].geometry}));
// }
//     console.log(samdata.data);

//     await listing.insertMany(samdata.data);
//     console.log('data is sended');
// }

// initdb();



if(process.env.NODE_ENV != 'production')
    require('dotenv').config();  // remove the path option entirely

const mongoose = require('mongoose');
const Listing = require('../models/listing');
const sampleListings = require('./samplelist');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

const mapboxToken = process.env.MAP_BOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });
const dbUrl = process.env.MONGODB_ATLAS_URL;

async function seedDB() {
  await mongoose.connect(dbUrl);
  console.log('✓ Connected to MongoDB');

  await Listing.deleteMany({});
  console.log('✓ Cleared existing listings');

  const listings = sampleListings.data || sampleListings;

  for (let listing of listings) {
    try {
      const response = await geocodingClient.forwardGeocode({
        query: `${listing.location}, ${listing.country}`,
        limit: 1
      }).send();

      const geometry = response.body.features[0]?.geometry || {
        type: 'Point',
        coordinates: [0, 0]
      };

      const newListing = new Listing({
        title: listing.title,
        description: listing.description,
        image: listing.image,
        price: listing.price,
        location: listing.location,
        country: listing.country,
        geometry: geometry
      });

      await newListing.save();
      console.log(`✓ Added: ${listing.title}`);
    } catch (err) {
      console.log(`❌ Failed: ${listing.title} — ${err.message}`);
    }
  }

  console.log('\n✅ Seeding complete!');
  await mongoose.connection.close();
}

seedDB().catch((err) => {
  console.error('Seeding failed:', err);
  mongoose.connection.close();
});