const express = require('express');
const bodyParser = require('body-parser');
const fetch = require("node-fetch");
const mongoose = require('mongoose');



// const helmet = require('helmet');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// MONGO
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://EpicN:wGLI0ccfbrU9ngfv@cluster0-8iybi.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collecion = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});

const countrySchema = new mongoose.Schema({
  'Province/State': String,
  lat: Number,
  lng: Number,
  'Country/Region': String,
  'Last Update': Number,
  Confirmed: Number,
  Deaths: Number,
  Recovered: Number,
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

app.get('/find', (req, res) => {
  res.render('find');
});

app.post('/find', (req, res) => {
  const { start, destination } = req.body;
  // console.log(start);
  // console.log(destination);

  const api_key = 'AIzaSyC3ABfQlr8Nj-T8xLSLcWePhYzA982e87k';
  const uri_start = `https://maps.googleapis.com/maps/api/geocode/json?address=${start}&key=${api_key}`;
  const uri_end = `https://maps.googleapis.com/maps/api/geocode/json?address=${destination}&key=${api_key}`;

  let startCoord, destinationCoord;
  const fetchStart = fetch(uri_start).then((response) => {
    return response.json();
  }).then((json) => {
    console.log(json);
    startCoord = json.results[0].geometry.location;
  });


  const fetchDestination = fetch(uri_end).then((response) => {
    return response.json();
  }).then((json) => {
    console.log(json);
    destinationCoord = json.results[0].geometry.location;
  });

  const redirectPromise = Promise.all([fetchStart, fetchDestination]).then(() => {
    const path = [startCoord, destinationCoord];
    res.redirect(`/show?path=${JSON.stringify(path)}`);
  });
  // res.redirect('/show');
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