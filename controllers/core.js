var geojson = require('../helpers/geojson');
var jsonp = require('../helpers/jsonp');
var mysql2geojson = require("mysql2geojson");
var mysql = require('mysql');
var pool = mysql.createPool({
    host : 'YourHost',
    user : 'UserName',
    password : 'YourPassword',
    database : 'Countries'
  });

module.exports.controller = function (app) {

  /* enable CORS */
  app.all('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
  });

  // Queries shapes interesections against the countries table return GeoJSON.
  app.get('/countries/intersect', function (req, res) {
    pool.getConnection(function (err, connection) {
      var path = req.query.path, lnglat = req.query.lnglat;
      switch (req.query.type) {

        // Query set-up for if the shape is a polygon.
      case 'polygon':
        connection.query('SELECT name_long, pop_est, AsWKT(SHAPE) as ' +
            'geometry FROM countries where st_intersects(SHAPE,GeomFromText(' +
            '"POLYGON((' + path + '))")) and pop_est > 4000;',
            function (err, rows) {
            mysql2geojson.parse({
              "data": rows,
              "format": "geojson",
              "callback": function (error, result) {
                if (error) {
                  console.log(error);
                  res.setHeader('Content-Type', 'application/json');
                  res.send(err);
                  connection.release();
                } else {
                  res.setHeader('Content-Type', 'application/json');
                  res.send(result);
                  connection.release();
                }
              }
            });
          });

        break;

      // Query set-up for if the shape is a polyline.
      case 'polyline':
        connection.query('SELECT name_long, pop_est, AsWKT(SHAPE) as geometry' +
            ' FROM countries where st_intersects(SHAPE,GeomFromText("LINESTRING' +
            '(' + path + ')")) and pop_est > 4000;', function (err, rows) {
            mysql2geojson.parse({
              "data": rows,
              "format": "geojson",
              "callback": function (error, result) {
                if (error) {
                  console.log(error);
                  res.setHeader('Content-Type', 'application/json');
                  res.send(err);
                  connection.release();
                } else {
                  res.setHeader('Content-Type', 'application/json');
                  res.send(result);
                  connection.release();
                }
              }
            });
          });
        break;

      // Query set-up for if the shape is a point.
      case 'point':
        connection.query('SELECT name_long, pop_est, AsWKT(SHAPE) as geometry' +
          ' FROM countries where st_intersects(SHAPE,GeomFromText("POINT(' +
          lnglat + ')")) and pop_est > 4000;', function (err, rows) {
            mysql2geojson.parse({
              "data": rows,
              "format": "geojson",
              "callback": function (error, result) {
                if (error) {
                  console.log(error);
                  res.setHeader('Content-Type', 'application/json');
                  res.send(err);
                  connection.release();
                } else {
                  res.setHeader('Content-Type', 'application/json');
                  res.send(result);
                  connection.release();
                }
              }
            });
          });
        break;
      }
    });
  });

  app.get('/countries/all', function (req, res) {
    pool.getConnection(function (err, connection) {
      connection.query('SELECT name_long, pop_est, AsWKT(SHAPE) as geometry' +
        ' FROM countries where pop_est > 4000;', function (err, rows) {
          connection.release();
          mysql2geojson.parse({
            "data": rows,
            "format": "geojson",
            "callback": function (error, result) {
              if (error) {
                console.log(error);
                res.setHeader('Content-Type', 'application/json');
                res.send(err);
              }
              res.setHeader('Content-Type', 'application/json');
              res.send(result);
            }
          });
        });
    });
  });
};
