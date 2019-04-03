/* Create Ride - JS */


// global counts

// global arrays


var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();
/*-----------------------------------------------------------*/

const createRideBtn = document.querySelector('#createRideBtn');
const viewRideBtn = document.querySelector('#viewRideBtn');
const inputField1 = document.querySelector('#inputOrigin');
const inputField2 = document.querySelector('#inputDestination');


createRideBtn.addEventListener('click',checkInputs);
viewRideBtn.addEventListener('click',checkInputs);
inputField1.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    checkInputs(event);
  }
})
inputField2.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    checkInputs(event);
  }
})

/*-----------------------------------------------------------*/

window.onload = function () {
	initMap();
	initialize();
	initializeTwo();
}


function checkInputs(e){
	const startingValue = document.querySelector('#inputOrigin').value;
	const endingValue = document.querySelector('#inputDestination').value;
		
	const emptyError = document.querySelector('#create_fail');
	const emptyError1 = document.querySelector('#emptyField1');
	const emptyError2 = document.querySelector('#emptyField2');
	const distTimeInfos = document.querySelector('#distTimeInfo');
	
	
	if(startingValue == '' && endingValue == ''){
		emptyError.style.display = 'block';
		emptyError1.style.display = 'block';
		emptyError2.style.display = 'block';
		distTimeInfos.style.display = 'none';
	}
	else if(startingValue == ''){
		emptyError.style.display = 'block';
		emptyError1.style.display = 'block';
		emptyError2.style.display = 'none';
		distTimeInfos.style.display = 'none';
	}
	else if(endingValue == ''){
		emptyError.style.display = 'block';
		emptyError1.style.display = 'none';
		emptyError2.style.display = 'block';
		distTimeInfos.style.display = 'none';
	}
	else{
		emptyError.style.display = 'none';
		emptyError1.style.display = 'none';
		emptyError2.style.display = 'none';
		
		if(e.target.id == "createRideBtn"){
			createRidePage();
		}
		
		if(e.target.id == "viewRideBtn"){
			viewRides();
		}
		if(e.type === "keyup"){
		   distTimeInfos.style.display = 'block';
		   findTheRoute();
		}
	}
	
}

function createRidePage(){
	let input = document.querySelector('#inputOrigin').value;
	let destination = document.querySelector('#inputDestination').value;
	let info = input + '__' + destination;
     url = 'create_ride.html?info=' + encodeURIComponent(info);
	document.location.href = url;
}

function viewRides(){
	document.location.href = 'view_rides.html';
}

var map;
var theCoord = {lat: 43.6532, lng: -79.3832}
function initMap() {
map = new google.maps.Map(document.getElementById('google_maps'), {
    center: theCoord,
    zoom: 8
});

//initialize();

directionsDisplay.setMap(map);
}


function initialize() {
      var input = document.getElementById('inputOrigin');
      var autocomplete = new google.maps.places.Autocomplete(input);

        autocomplete.bindTo('bounds', map);
        autocomplete.setFields(
            ['address_components', 'geometry', 'icon', 'name']);
        google.maps.event.addListener(autocomplete, 'place_changed', function(){
         var place = autocomplete.getPlace();
      })
}

function initializeTwo() {
      var inputTwo = document.getElementById('inputDestination');
      var autocompleteTwo = new google.maps.places.Autocomplete(inputTwo);
        autocompleteTwo.bindTo('bounds', map);
        autocompleteTwo.setFields(
            ['address_components', 'geometry', 'icon', 'name']);
      google.maps.event.addListener(autocompleteTwo, 'place_changed', function(){
         var placeTwo = autocompleteTwo.getPlace();
      })
}

function findTheRoute() {
    var myreq = {
        origin: document.querySelector("#inputOrigin").value,
        destination: document.querySelector("#inputDestination").value,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }

    directionsService.route(myreq, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {

		   const distText = document.querySelector('#distInfo');
			distText.innerHTML = "<strong>Total Ride Distance: </strong> " + (result.routes[0].legs[0].distance.value)/1000 + " KM  " + "<strong>Total Ride Duration: </strong> " + result.routes[0].legs[0].duration.text + "";
            directionsDisplay.setDirections(result);
        } else {
            directionsDisplay.setDirections({routes:[]});
            map.setCenter(theCoord);
			console.log("This address is not valid")
        }
    });

}
