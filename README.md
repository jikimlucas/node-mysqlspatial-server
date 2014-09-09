Node MySQL Server
============

Node.js application to provide a GeoJSON-based REST interface to MySQL data.

This code is based on code originally released by Bill Dollins, as described here: http://blog.geomusings.com/2014/02/18/a-little-deeper-with-node-and-postgis

This code is designed to run on Google Compute Engine using a backports wheezy Debian instance. It uses MySQL 5.6, which has basic spatial queries. You need to create the database somewhere. Google Cloud SQL has [https://developers.google.com/cloud-sql/] has a 5.6 version you can set-up. Regardless of where you're hosting your MySQL, you'll need to edit the controllers/core.js file to add in your own login information. 

startupscript.sh installs all the dependencies, creates the database, downloads country border data from http://naturalearthdata.com and loads it into the database. This can take several minutes. You can monitor progress in /var/log/startupscript.log.

To run the server, run node server from the /src/node-mysqlspatial-server directory. It will then be available at your IP address. drawing.html displays a map with drawing tools. These tools appear at the top of the map, and when you use them for drawing you get back the countries that match that query. The rectangle and marker tools are the easiest to use.

before you run the startup script, change all instances of "manotest" to your own database name, and all instances of "mmarks" to your own username on Compute Engine.


See package.json for dependencies.

