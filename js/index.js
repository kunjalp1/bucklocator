var map;
var markers = [];
var infoWindow;
var locationSelect;

function initMap() {
  // var india = {lat: 20.5937, lng: 78.9629};
  var losAngeles = {
    lat: 34.065235,
    lng: -118.354790
  }

  map = new google.maps.Map(document.getElementById('map'), {
    center: losAngeles,
    zoom: 13,
    mapTypeId: 'roadmap',

    styles: [{
        elementType: 'geometry',
        stylers: [{
          color: '#242f3e'
        }]
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [{
          color: '#242f3e'
        }]
      },
      {
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#746855'
        }]
      },
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#d59563'
        }]
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#d59563'
        }]
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{
          color: '#263c3f'
        }]
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#6b9a76'
        }]
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{
          color: '#38414e'
        }]
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#212a37'
        }]
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#9ca5b3'
        }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{
          color: '#746855'
        }]
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{
          color: '#1f2835'
        }]
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#f3d19c'
        }]
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{
          color: '#2f3948'
        }]
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#d59563'
        }]
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{
          color: '#17263c'
        }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{
          color: '#515c6d'
        }]
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{
          color: '#17263c'
        }]
      }
    ]
  });
  infoWindow = new google.maps.InfoWindow();
  searchStores();     /* this function is called here as it show all stores initially */
}


function cancel() {                 /*this function clear's the search data */
  document.getElementById('zip-code-input').value = null;  /* By putting NULL value*/

  clearLocations();                 /* this remove all previous searched markers and remove over lap issue */
  displayStores(stores);            /* this will display all stores in the list */
  showStoreMarkers(stores);         /* this put all the store marker */
  setOnClickListener();           /* this show's InfoWindow on the marker */
}

function searchStores() {         /* this function will call when we click on the search icon */
  var foundStore =[];
  var searchData = document.getElementById('zip-code-input').value;  /*It take data from zip-code-input */

    if(searchData) {
      stores.forEach(function(store, index){
         var postal = store.address.postalCode.substring(0, 5);
         if(postal == searchData || index == searchData){
           foundStore.push(store);
         } 
         /* Put a else statement for invalid intup */
      })
    } else {   /*if SearchData is empty than it assign foundStore to Original Stores list */
      foundStore = stores;
    }
    clearLocations();                 /* this remove all previous searched markers and remove over lap issue */
    displayStores(foundStore);        /* this will display all stores in the list */
    showStoreMarkers(foundStore);     /* this put all the store marker */
    setOnClickListener();             /* this show's InfoWindow on the marker */
}

function clearLocations() {
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {    /* Its loops thourgh map and remove all the marker*/
      markers[i].setMap(null);                    /* by using setMap(null) */
    }
    markers.length = 0;     /* Here we clearing out the elements markers array */
}

function setOnClickListener() {
    var storeElement = document.querySelectorAll(".store-container");  /* here we use querySelectorAll because */
    storeElement.forEach(function(elem, index) {                       /* it --- on all store-container */
      elem.addEventListener('click', function(){
        new google.maps.event.trigger(markers[index], 'click');
      })  
    })
}

function displayStores(stores) {
  var storesHTML = '';
  stores.forEach(function (store, index) {

    var address = store.addressLines;
    var phone = store.phoneNumber;

    storesHTML += `
      <div class="store-list">
          <div class="store-container">
              <div class="store-container-background">
                  <div class="store-info-container">
                      <div class="store-address">
                          <span>${address[0]}</span>
                          <span>${address[1]}</span>
                      </div>
                      <p class="store-phone-number">${phone}</p>
                  </div>
                  <div class="store-number-container">
                      <div class="store-number">${index+1}</div>
                  </div>
              </div>
          </div>
      </div>
    `

    document.querySelector(".store-list").innerHTML = storesHTML;
  });
}


function showStoreMarkers(stores) {
  var bounds = new google.maps.LatLngBounds(); /* Bound here is used for magnify the markers locatoin */
  
  stores.forEach(function (store, index) {
    var latlng = new google.maps.LatLng(
      store.coordinates.latitude,
      store.coordinates.longitude
    );

    var name = store.name;
    var address = store.addressLines[0];
    var brandName = store.brandName;

    createMarker(latlng, name, address, brandName, index);
    bounds.extend(latlng);
  });
  map.fitBounds(bounds);
}

function createMarker(latlng, name, address, brandName, index) {
  
  var html = "<p>"+ brandName + "</p> <hr>" + "<b>" + name + "</b> <br/>" + address;
  var marker = new google.maps.Marker({
    map: map,
    position: latlng,
    label: `${index+1}` /* convert index integer to String, as lable has String data type*/
  });
  google.maps.event.addListener(marker, 'click', function () {
    infoWindow.setContent(html);
    infoWindow.open(map, marker);
  });
  markers.push(marker);
}