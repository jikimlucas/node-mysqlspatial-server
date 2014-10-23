var geojson = require('../helpers/geojson');
var jsonp = require('../helpers/jsonp');
var mysql2geojson = require('mysql2geojson');
var mysql = require('mysql');

var pool = mysql.createPool({
  host: '173.194.251.67',
  user: 'root',
  password: 'rootMano',
  database: 'Countries'
});

module.exports.controller = function(app) {
  // Queries shapes interesections against the countries table return GeoJSON.
  app.get('/countries/intersect', function(req, res) {
    pool.getConnection(function(err, connection) {
      var type = req.query.type.toUpperCase();
      // Set-up query.
      var connstr;
      if (type === 'ALL') {
        connstr = 'SELECT name_long, pop_est, AsWKT(SHAPE) as geometry' +
        ' FROM countries where pop_est > 4000;';
      } else {
        var path = req.query.path;
        var pathString;
        if (type === 'POLYLINE') {
          pathString = connection.escape('LINESTRING(' + path + ')') + '))' +
          ' and pop_est > 4000;';
        }
        if (type === 'POINT') {
          pathString = connection.escape('POINT(' + req.query.lnglat +
          ')') + ')) and pop_est > 4000;';
        }
        if (type === 'POLYGON') {
          pathString = connection.escape('POLYGON((' + path + '))') + '))' +
          ' and pop_est > 4000;';
        }
        connstr = 'SELECT name_long, pop_est, AsWKT(SHAPE) as ' +
        'geometry FROM countries where st_intersects(SHAPE,GeomFromText(' +
        pathString;
      }

      // Send off query and return result.
      connection.query(connstr, function(err, rows) {
        mysql2geojson.parse({
        data: rows,
        format: 'geojson',
        callback: function(error, result) {
          connection.release();
          res.setHeader('Content-Type', 'application/json');
          res.send(err || result);
        }
      });
    });
  });
});
};
