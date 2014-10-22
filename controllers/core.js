var geojson = require('../helpers/geojson');
var jsonp = require('../helpers/jsonp');
var mysql2geojson = require('mysql2geojson');
var mysql = require('mysql');

var pool = mysql.createPool({
  host: 'YourHost',
  user: 'UserName',
  password: 'YourPassword',
  database: 'Countries'
});

module.exports.controller = function(app) {
  // Queries shapes interesections against the countries table return GeoJSON.
  app.get('/countries/intersect', function(req, res) {
    pool.getConnection(function(err, connection) {
      var path = req.query.path;
      var type = req.query.type.toUpperCase();
      if (type === 'POLYLINE') {
        type = 'LINESTRING';
      }
      if (type === 'POINT') {
        path = req.query.lnglat;
      }

      // Set-up query.
      connection.query('SELECT name_long, pop_est, AsWKT(SHAPE) as ' +
        'geometry FROM countries where st_intersects(SHAPE,GeomFromText(' +
        '"' + type + '((' + path + '))")) and pop_est > 4000;',
        handleResult(res, connection, err, result)
        );
    });
  });
  app.get('/countries/all', function(req, res) {
    pool.getConnection(function(err, connection) {
      // Set-up query.
      connection.query('SELECT name_long, pop_est, AsWKT(SHAPE) as geometry' +
        ' FROM countries where pop_est > 4000;',
        handleResult(res, connection, err, result)
        );
    }
      );
  });

  function handleResult(res, connection, err, result) {
    connection.release();
    mysql2geojson.parse({
      data: rows,
      format: 'geojson',
      callback: function(error, result) {
        res.setHeader('Content-Type', 'application/json');
        res.send(err || result);
      }
    });
  }
};

