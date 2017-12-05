
    var map;
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 51.6507151, lng: 11.3126331},
        zoom: 8,
        styles: gmstyle
      });
    };
