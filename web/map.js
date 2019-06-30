function initMap() {
  var map = new google.maps.Map(
      document.getElementById('map'), {zoom: 8, center: {lat: 37, lng: -122}});
  var tracker = []
  
  function recurse() {
  setTimeout(()=> {
      $.get("http://alleviair.herokuapp.com/get_points", data => {
        console.log(data);
        for (point in data) {
          console.log(data[point]);
          if (tracker.filter(obj => obj.id === data[point].id).length == 0){
            tracker.push(data[point]);
            var loc = {lat: Number(data[point].latitude), lng: Number(data[point].longitude)};
            new google.maps.Marker({position: loc, title: data[point].title, map: map});
            console.log('Added point!');
          }
          recurse();
        }
      });
    }, 5000)
  }
  recurse();
}