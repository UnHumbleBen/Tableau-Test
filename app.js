const express = require('express');
const bodyParser = require('body-parser');


// const helmet = require('helmet');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));


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
  console.log(start);
  console.log(destination);

  res.redirect('/show');
});

app.get('/show', (req, res) => {
  const path = req.query.path;
  let flightPlanCoordinates;
  if (req.query.path) {
    flightPlanCoordinates = JSON.parse(req.query.path);
  } else {
    // fallback
    flightPlanCoordinates = [
      { lat: 37.772, lng: -122.214 },
      { lat: 21.291, lng: -157.821 },
      { lat: -18.142, lng: 178.431 },
      { lat: -27.467, lng: 153.027 }
    ];
  }
  res.render('show', { path: flightPlanCoordinates });
});

app.listen(process.env.PORT, process.env.IP, () => {
  // eslint-disable-next-line no-console
  console.log('The server has started!');
});