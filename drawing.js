/**
 * @fileoverview Description of this file.
 */

// Indicates whether to display the info box which shows the population of a
// feature.
var ibDisplay = false;
function initialize() {
  var mapOptions = {
    center: new google.maps.LatLng(0, 0),
    zoom: 3
  };
  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);
  var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        google.maps.drawing.OverlayType.POLYGON,
        google.maps.drawing.OverlayType.POLYLINE,
        google.maps.drawing.OverlayType.RECTANGLE,
        google.maps.drawing.OverlayType.MARKER
      ]
    }
  });
  drawingManager.setMap(map);
  google.maps.event.addListener(drawingManager, 'overlaycomplete',
      function(event) {
        google.maps.event.clearListeners(map.data, 'addfeature');
        map.data.setMap(null);
        map.data = new google.maps.Data({map: map});
        map.data.addListener('addfeature', function(event) {
          updateInfoBox(event);
        });
  map.data.addListener('mouseover', function(event) {
    updateInfoBox(event);
  });

  event.overlay.setMap(null);    
  switch (event.type) {
    case 'polygon':
      var pathArray = event.overlay.getPath().getArray();
      pathArray.push(pathArray[0]);
      var stringArray = [];
      pathArray.forEach(function(element, index) {
        stringArray.push(element.lng() + ' ' + element.lat());
      });
      var pathString = stringArray.join(',');
      map.data.loadGeoJson('/countries/intersect?type=polygon&path=' +
          pathString);
      break;
    case 'rectangle':
      var bounds = event.overlay.getBounds();
      var ne = bounds.getNorthEast();
      var sw = bounds.getSouthWest();
      var stringArray = [];
      stringArray.push(ne.lng() + ' ' + ne.lat());
      stringArray.push(ne.lng() + ' ' + sw.lat());
      stringArray.push(sw.lng() + ' ' + sw.lat());
      stringArray.push(sw.lng() + ' ' + ne.lat());
      stringArray.push(ne.lng() + ' ' + ne.lat());
      var pathString = stringArray.join(',');
      map.data.loadGeoJson('/countries/intersect?type=polygon&path=' +
          pathString);
      break;
    case 'polyline':
      var pathArray = event.overlay.getPath().getArray();
      var stringArray = [];
      pathArray.forEach(function(element, index) {
        stringArray.push(element.lng() + ' ' + element.lat());
      });
      var pathString = stringArray.join(',');
      map.data.loadGeoJson('/countries/intersect?type=polyline&path=' +
          pathString);
      break;
    case 'marker':
      var latlng = event.overlay.getPosition();
      var lnglat = latlng.lng() + ' ' + latlng.lat();
      map.data.loadGeoJson('/countries/intersect?type=point&lnglat=' +
          lnglat);
      break;
  }
});
}
function updateInfoBox(event) {
    if (!ibDisplay) {
      ibDisplay = true;
      document.getElementById('info-box').style.display = 'inline';
    }
    document.getElementById('info-box').textContent =
        event.feature.getProperty('name_long') + ' estimated population: ' +
        (Math.round(event.feature.getProperty('pop_est'), 0)).toLocaleString();
}
function formatNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
google.maps.event.addDomListener(window, 'load', initialize);

