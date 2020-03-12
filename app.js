const express = require('express');
const bodyParser = require('body-parser');
const fetch = require("node-fetch");
const mongoose = require('mongoose');



// const helmet = require('helmet');

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

const mapProvinceToCoord = {};
// MONGO
// const rawdataSchema = new mongoose.Schema({
//   'Province/State': String,
//   lat: String,
//   lng: String,
//   'Country/Region': String,
//   'Last Update': String,
//   Confirmed: String,
//   Deaths: String,
//   Recovered: String,
// });
// const Rawdata = mongoose.model('rawdata', rawdataSchema, 'rawdata');

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://EpicN:wGLI0ccfbrU9ngfv@cluster0-8iybi.gcp.mongodb.net/test?retryWrites=true&w=majority";
// const uri = "mongodb+srv://EpicN:wGLI0ccfbrU9ngfv@cluster0-8iybi.gcp.mongodb.net/test";
// const uri = "mongodb+srv://EpicN:<password>@cluster0-8iybi.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(client);
client.connect(err => {
  if (err) {
    console.log(err);
  } else {
    const collection = client.db("viralwatch").collection("rd2");


    collection.find({}).toArray(function (err, docs) {
      if (err) {
        return console.log(err);
      }

      docs.forEach((doc) => {
        const province = doc['Province/State'];
        const state = doc['Country/Region'];
        const lat = doc.lat;
        const lng = doc.lng;
        mapProvinceToCoord[`${province}, ${state}`] = { 'lat': lat, 'lng': lng };
      });

      console.log(docs);
      delete mapProvinceToCoord[', null'];
      console.log(mapProvinceToCoord);
    });

    // console.log(collection);

    // perform actions on the collection object
    /*collection.find({}, (err, documents) => {
      // console.log('this ran', documents);
      console.log(documents.toArray());
      if (err) {
        console.log('something went wrong with parsing data!');
      } else {
        documents.map(document => {
          const province = document['Province/State'];
          const state = document['Country/Region'];
          const lat = document.lat;
          const lng = document.lng;
          mapProvinceToCoord[`${province}, ${state}`] = { 'lat': lat, 'lng': lng };
          console.log(province);
          client.close();
        });
        console.log('mapProvinceToCoord =', mapProvinceToCoord);
      }
    });*/
  }
});





// app.use(helmet.frameguard({
//   action: 'allow-from',
//   domain: 'https://public.tableau.com/profile/ellenn#!/vizhome/WorldIndicators/GDPpercapita?:size=1837,1&:embed=y&:showVizHome=n&:bootstrapWhenNotified=y&:apiID=host0#navType=1&navSrc=Parse'
// }));
// app.use(helmet({
//   frameguard: false,
// }));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/viz', (req, res) => {
  res.render('viz');
});

app.get('/find', (req, res) => {
  console.log('mapProvinceToCoord = ', mapProvinceToCoord);
  res.render('find', { mapProvinceToCoord });
});

function replaceStringsWithNumbers(map) {
  let newMap = map;
  // for (key in Object.keys(map)) {
  //   console.log(key);
  //   newMap[key] = parseFloat(map[key]);
  // }

  Object.keys(map).forEach((key) => {
    newMap[key] = parseFloat(map[key]);
  });
  return newMap;
}

app.post('/find', (req, res) => {
  let { start, waypointA, waypointB, destination } = req.body;
  start = JSON.parse(start);
  waypointA = JSON.parse(waypointA);
  waypointB = JSON.parse(waypointB);
  destination = JSON.parse(destination);

  if (typeof start.lat === 'string') {
    start = replaceStringsWithNumbers(start);
    waypointA = replaceStringsWithNumbers(waypointA);
    waypointB = replaceStringsWithNumbers(waypointB);
    destination = replaceStringsWithNumbers(destination);
  }

  // console.log(req.body);
  // console.log(start);
  // console.log(destination);

  // const api_key = 'AIzaSyC3ABfQlr8Nj-T8xLSLcWePhYzA982e87k';
  // const uri_start = `https://maps.googleapis.com/maps/api/geocode/json?address=${start}&key=${api_key}`;
  // const uri_waypoint_a = `https://maps.googleapis.com/maps/api/geocode/json?address=${waypointA}&key=${api_key}`;
  // const uri_waypoint_b = `https://maps.googleapis.com/maps/api/geocode/json?address=${waypointB}&key=${api_key}`;
  // const uri_end = `https://maps.googleapis.com/maps/api/geocode/json?address=${destination}&key=${api_key}`;

  // let startCoord, destinationCoord, waypointACoord, waypointBCoord;
  // const fetchStart = fetch(uri_start).then((response) => {
  //   return response.json();
  // }).then((json) => {
  //   console.log(json);
  //   startCoord = json.results[0].geometry.location;
  // });

  // const fetchA = fetch(uri_waypoint_a).then((response) => {
  //   return response.json();
  // }).then((json) => {
  //   console.log(json);
  //   waypointACoord = json.results[0].geometry.location;
  // });

  // const fetchB = fetch(uri_waypoint_b).then((response) => {
  //   return response.json();
  // }).then((json) => {
  //   console.log(json);
  //   waypointBCoord = json.results[0].geometry.location;
  // });

  // const fetchDestination = fetch(uri_end).then((response) => {
  //   return response.json();
  // }).then((json) => {
  //   console.log(json);
  //   destinationCoord = json.results[0].geometry.location;
  // });

  // const redirectPromise = Promise.all([fetchStart, fetchDestination]).then(() => {
  //   const path = [startCoord, destinationCoord];
  //   const { startLat, startLong } = startCoord;
  //   const { destLat, destLong } = destinationCoord;
  //   console.log(startCoord);
  //   console.log(waypointACoord);
  //   console.log(waypointBCoord);
  //   console.log(destinationCoord);
  //   res.redirect(`/show?path=${JSON.stringify(path)}`);
  // });
  // res.redirect('/show');
  path = [start, waypointA, waypointB, destination];
  // console.log('path.toString()', path.toString());
  // console.log('JSON.stringify(path)', JSON.stringify(path));
  console.log(`rendering...:/show?path=${JSON.stringify(path)}`)
  res.redirect(`/show?path=${JSON.stringify(path)}`);
  // res.redirect(`/ show ? path = [${ path.toString() }]`);
});

app.get('/show', (req, res) => {
  const path = req.query.path;
  let flightPlanCoordinates;
  if (req.query.path) {
    flightPlanCoordinates = JSON.parse(req.query.path);
    res.render('show', { path: flightPlanCoordinates });
  } else {
    // fallback
    res.render('find', { alert: true });
  }
});

app.listen(process.env.PORT, process.env.IP, () => {
  // eslint-disable-next-line no-console
  console.log('The server has started!');
});