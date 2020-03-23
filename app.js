const express = require('express');
const bodyParser = require('body-parser');
const fetch = require("node-fetch");
const mongoose = require('mongoose');

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

/**
 * Mocks a API call to a database to lookup COVID-19 statistics.
 * @param {{position: {lat: number, lng: number}, date: string}[]} dest An
 * array of destination objects given by `position` and `date`.
 * @returns {Promise<{position: {lat: number, lng: number}, date: string, risk_level: number confirmed: number, death: number}[]>}
 * A promise which resolves into an array of destination objects
 * with newly added fields from the database.
 */
function mockFetchCovid19Statistics(dest) {
  let promises = []
  dest.forEach(destination => {
    const { lat, lng } = destination.position;
    const uri = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&result_type=administrative_area_level_1&key=AIzaSyC3ABfQlr8Nj-T8xLSLcWePhYzA982e87k`;
    const promise = fetch(uri)
      .then(res => res.json())
      .then(json => json.results[0].formatted_address);
    promises.push(promise);
  });
  return Promise.all(promises).then((formatted_addresses => {
    for (let i = 0; i < dest.length; i += 1) {
      const destination = dest[i];
      const formatted_address = formatted_addresses[i];
      const risk_level = Math.random() * 100;
      const confirmed = Math.round(Math.random() * 100000);
      const death = Math.round(Math.random() * 1000);

      destination.risk_level = risk_level;
      destination.formatted_address = formatted_address;
      destination.confirmed = confirmed;
      destination.death = death;
    }
    return dest;
  }));
}

app.post('/find', (req, res) => {
  try {
    let { dest } = req.body;
    console.log('dest', dest);

    // Parse every destination's position string into a LatLng object.
    dest.forEach(map => {
      map.position = JSON.parse(map.position);
    });
    console.log('parse dest', dest);

    dest.forEach(destination => {
      position = destination.position;
      position.lat = parseFloat(position.lat);
      position.lng = parseFloat(position.lng);
    });

    mockFetchCovid19Statistics(dest).then((dest) => {
      console.log('after promise\n', dest);
      res.redirect(`/show?dest=${JSON.stringify(dest)}`);
      console.log('API CALL:', `/show?dest=${JSON.stringify(dest)}`);
    });
  } catch (error) {
    console.log(error);
    res.render('find', { mapProvinceToCoord, alert: true });
  }
});

app.get('/show', (req, res) => {
  try {
    let dest = req.query.dest;
    console.log('dest:', dest);

    dest = JSON.parse(dest);
    console.log('parsed dest:', dest);

    res.render('show', { dest });
  } catch (error) {
    res.render('find', { mapProvinceToCoord, alert: true });
  }
});

app.listen(process.env.PORT, process.env.IP, () => {
  // eslint-disable-next-line no-console
  console.log('The server has started!');
});