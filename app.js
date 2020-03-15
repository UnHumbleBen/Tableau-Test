const express = require('express');
const bodyParser = require('body-parser');
const fetch = require("node-fetch");
const mongoose = require('mongoose');



// const helmet = require('helmet');

const app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

const mapProvinceToCoord = {};
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://EpicN:wGLI0ccfbrU9ngfv@cluster0-8iybi.gcp.mongodb.net/test?retryWrites=true&w=majority";
// const uri = "mongodb+srv://EpicN:wGLI0ccfbrU9ngfv@cluster0-8iybi.gcp.mongodb.net/test";
// const uri = "mongodb+srv://EpicN:<password>@cluster0-8iybi.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
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

      delete mapProvinceToCoord[', null'];
      console.log('Database retrieval complete!');
    });
  }
});

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

function replaceStringsWithNumbersArray(arr) {
  return arr.map((map) => replaceStringsWithNumbers(map));
}

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
  try {
    let { dest } = req.body;
    console.log('dest', dest);

    dest = dest.map(destString => JSON.parse(destString));

    console.log(dest);

    res.redirect(`/show?path=${JSON.stringify(dest)}`);
    console.log('API CALL:', `/show?path=${JSON.stringify(dest)}`);
  } catch (error) {
    res.render('find', { mapProvinceToCoord, alert: true });
  }
});

app.get('/show', (req, res) => {
  try {
    // const path = req.query.path;
    let flightPlanCoordinates;
    // console.log('path:', path);
    flightPlanCoordinates = JSON.parse(req.query.path);
    flightPlanCoordinates = replaceStringsWithNumbersArray(flightPlanCoordinates);
    res.render('show', { path: flightPlanCoordinates });
  } catch (error) {
    res.render('find', { mapProvinceToCoord, alert: true });
  }
  // if (req.query.path) {
  //   flightPlanCoordinates = JSON.parse(req.query.path);
  //   flightPlanCoordinates = replaceStringsWithNumbersArray(flightPlanCoordinates);
  //   res.render('show', { path: flightPlanCoordinates });
  // } else {
  //   // fallback
  //   res.render('find', { alert: true });
  // }
});

app.listen(process.env.PORT, process.env.IP, () => {
  // eslint-disable-next-line no-console
  console.log('The server has started!');
});