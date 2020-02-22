const express = require('express');

// const helmet = require('helmet');

const app = express();

app.use(express.static('public'));

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

app.listen(process.env.PORT, process.env.IP, () => {
  // eslint-disable-next-line no-console
  console.log('The server has started!');
});