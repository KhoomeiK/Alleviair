function initMap () {
  var map = new google.maps.Map(
    document.getElementById('map'), { zoom: 8, center: { lat: 37, lng: -122 } });
  var tracker = [];

  // Load points initially then start a 5s infinite loop to update the points
  loadPoints(() => {
    function recurse () {
      setTimeout(() => loadPoints(recurse), 5000);
    }
    recurse();
  });

  function loadPoints (callback) {
    $.get('https://alleviair.herokuapp.com/get_points', data => {
      // console.log(data);
      for (let point in data) {
        // console.log(data[point]);
        if (tracker.filter(obj => obj.id === data[point].id).length === 0) {
          tracker.push(data[point]);
          var loc = { lat: Number(data[point].latitude), lng: Number(data[point].longitude) };
          new google.maps.Marker({ position: loc, title: data[point].title, map: map });
          console.log(`Added point: ${data[point].title}`);
        }
      }
      callback();
    });
  }
}
