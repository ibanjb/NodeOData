const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fetch = require('node-fetch');

const port = process.env.PORT || 3000;
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/odata', {useNewUrlParser: true});

router.get('/', function(req, res) {
  this.getData(this.setData);
  res.json({ message: 'Its running!'});
});

app.use('/api', router);
app.listen(port);

console.log('Running at: ' + port);

setData = (data) => {
  const baseimage = 'https://agenda.cultura.gencat.cat';
  const Model = mongoose.model('AgendaCultural', { 
    id: Number,
    codi: String,
    comarcaMunicipi: String,
    dataFi: String,
    dataInici: String,
    denominacio: String,
    descripcio: String,
    enllacos: String,
    espai: String,
    imatges: String,
    latitud: String,
    longitud: String,
    tagsCategories: String,
    tagsAmbits: String,
    videos: String,
  });
  let i = 0;
  for (let i = 0; i < data.length; i += 1) {
    const item = data[i];
    i += 1;
    const imatges = item.imatges.split(',');
    for (let j = 0; j < imatges.length; j += 1) {
      imatges[j] = baseimage + imatges[j];
    }
    const imageResult = imatges.join(',');
    const nouItem = new Model({ 
      id: i,
      codi: item.codi,
      comarcaMunicipi: item.comarca_i_municipi,
      dataFi: item.data_fi,
      dataInici: item.data_inici,
      denominacio: item.denominaci,
      descripcio: item.descripcio,
      enllacos: item.enlla_os,
      espai: item.espai,
      imatges: imageResult,
      latitud: item.latitud,
      longitud: item.longitud,
      tagsCategories: item.tags_categor_es,
      tagsAmbits: item.tags_mbits,
      videos: item.v_deos,
     });
    nouItem.save();
  }
};

getData = (setData) => {  
  const entryPoint = 'https://analisi.transparenciacatalunya.cat/resource/ta2y-snj2.json';
  fetch(entryPoint, {
        method: 'GET',
        headers: {
            'X-App-Token': 'jZ3MPGQoj3eEvtak4Sh9KXJDQ'
        }
    })
    .then(res => res.json())
    .then(json => setData(json))
    .catch(function(err) {
        console.error(err);
    });
};
