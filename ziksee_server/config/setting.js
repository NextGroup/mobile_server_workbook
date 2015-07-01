var setting = {
  mysql : {
    host        : 'localhost',
    query       : { pool : true },
    user        : 'root',
    password    : "kl;'",
    database    : 'ziksee',
    selectlimit : 10,
    timeout     : 40000 
  },
  mqtt : {
    port 	: 1883,
    broker	: 'mqtt://localhost'
  },
  map : {
    latlimit  : 0.001,
    lnglimit  : 0.001, 
  },
  push : {
    latlimit  : 0.0005,
    lnglimit  : 0.0005
  },
  imageResize: {
    width  : 500,
    height : 500
  }
};

module.exports = setting;
