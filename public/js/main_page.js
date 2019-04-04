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
const seatsSelect = document.querySelector('#select_seats');
var seats;

//createRideBtn.addEventListener('click',checkInputs);
viewRideBtn.addEventListener('click',checkInputs);
seatsSelect.addEventListener('click', selectSeats);
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
		
		if(e.target.id == "viewRideBtn"){
			searchRidePage();
		}
		if(e.type === "keyup"){
		   distTimeInfos.style.display = 'block';
		   findTheRoute();
		}
	}
	
}


function selectSeats(e) {
	e.preventDefault();
    console.log("Inside select seats");
	if(e.target.type == "button"){
        console.log("Inside button seats");
		seats = e.target.innerText;
		e.target.classList = 'btn btn-success'
		
		const theParent = e.target.parentElement;
		for (let i = 0; i < theParent.children.length; i++) {
			if(theParent.children[i].id != e.target.id && theParent.children[i].type == "button"){
				theParent.children[i].classList = 'btn btn-primary';
			}
		}
	}
    
    console.log(seats);
	

}


function searchRidePage(){
	let origin = document.querySelector('#inputOrigin').value;
	let destination = document.querySelector('#inputDestination').value;
    console.log("INSIDE SEARCH RIDE PAGE")
    console.log(origin);
    console.log(destination);
    console.log(seats);
    
    var url = '/rides/search';
    // The data we are going to send in our request
    let data = {
        origin: origin,
		destination: destination,
        seatsOccupied: seats,
    }
    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: 'post', 
        body: JSON.stringify(data),
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    });
    fetch(request)
    .then(function(res) {
        // Handle response we get from the API
        // Usually check the error codes to see what happened
        if (res.status === 200) {
            console.log('Added ride')
			create();
           
        } else {
            console.log('Could not add ride.');
     
        }
        console.log(res)
        
    }).catch((error) => {
        console.log(error)
    })
    
	//let info = input + '__' + destination;
     //url = 'create_ride.html?info=' + encodeURIComponent(info);
	//document.location.href = '/rides/view';
    document.location.href = '/rides/view';
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
