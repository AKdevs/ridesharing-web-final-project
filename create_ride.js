/* Create Ride - JS */

var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();

// global counts
let numberOfRides = 0; // total number of ride

// global arrays
const rides = [] // Array of rides owned by the user

// Ride
class theRides {
	constructor(starting_point, destination, car, seats, departure_date, departure_time) {
		this.starting_point = starting_point;
		this.destination = destination;
		this.car = car;
		this.seats = seats; // will be the patron objet
		this.departure_date = departure_date;
		this.departure_time = departure_time;

		// set ride ID
		this.user_rides_id = numberOfRides;
		numberOfRides++;
	}


}


const locationInfo = document.querySelector('#location_info');

const createRide = locationInfo.querySelector('#ticket_info');

const carSelect = document.querySelector('#select_uber');
const seatsSelect = document.querySelector('#select_seats');
const submitBtn = document.querySelector('#create_button');
const viewMyRide = document.querySelector('#viewMyRide');
const dtPicker = document.querySelector("#distTimeCostInfo");

let car;
let seats;
let theDate;
let theTime;

const inputFieldOne = document.querySelector('#inputOrigin2');
const inputFieldTwo = document.querySelector('#inputDestination2');

let theStart = inputFieldOne.value;
let theEnd = inputFieldTwo.value;

/* Event listeners for button submit and button click */

carSelect.addEventListener('click', selectCar);
seatsSelect.addEventListener('click', selectSeats);
viewMyRide.addEventListener('click', viewTheRides);
submitBtn.addEventListener('click', createTicketMethod)

inputFieldOne.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    checkInputs2(event);
  }
})
inputFieldTwo.addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
    checkInputs2(event);
  }
})

loggedInUser = "";

/*-----------------------------------------------------------*/

window.onload = function () {
	
  const url = '/users/getloggedusername';

  fetch(url)
  .then((res) => {
    if (res.status === 200) {
      return res.json()
    }
    else {
      console.log("Not logged in");
    }
  })
  .then((res) => {
    loggedInUser = res;
	console.log(loggedInUser.username);
  }).catch((error) => {
    console.log(error)
  })
	
	calendarInitialization();
	initMap();
	initialize();
	initializeTwo();
	
}



function checkInputs2(e){
	const startingValue = document.querySelector('#inputOrigin2').value;
	const endingValue = document.querySelector('#inputDestination2').value;
		
	const emptyError = document.querySelector('#create_fail');
	const emptyError1 = document.querySelector('#emptyField1');
	const emptyError2 = document.querySelector('#emptyField2');
	
	
	if(startingValue == '' && endingValue == ''){
		emptyError.style.display = 'block';
		emptyError1.style.display = 'block';
		emptyError2.style.display = 'block';
	}
	else if(startingValue == ''){
		emptyError.style.display = 'block';
		emptyError1.style.display = 'block';
		emptyError2.style.display = 'none';
	}
	else if(endingValue == ''){
		emptyError.style.display = 'block';
		emptyError1.style.display = 'none';
		emptyError2.style.display = 'block';
	}
	else{
		emptyError.style.display = 'none';
		emptyError1.style.display = 'none';
		emptyError2.style.display = 'none';
		
		if(e.type === "keyup"){
		   findTheRoute();
		   

		}
	}
	
}

function createTicketMethod(){
	theCost = getCost();
	console.log("$" + theCost);
	let origin = document.querySelector('#inputOrigin2').value;
    let destination = document.querySelector('#inputDestination2').value;
    console.log(origin);
    console.log(destination);
    console.log(seats);
	console.log('TICKET INFO')
	
	theDate = document.querySelector('input[type="date"]').value;
	theTime = document.querySelector('input[type="time"]').value;
    console.log(new Date(theDate + " " + theTime))
    var url = '/rides/create';
    // The data we are going to send in our request
    let data = {
		members: [],
		owner: loggedInUser.username,
		carType:car,
		origin:origin,
		destination:destination,
		seatsOccupied:seats,
		departureTime: new Date(theDate+theTime),
		cost:theCost
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
			
		//$('#ticket_info').modal();
		//	displayTicket();	
		
           
        } else {
            console.log('Could not add ride.');
     
        }
        console.log(res)
        
    }).catch((error) => {
        console.log(error)
    })
    
    document.location.href = '/rides/own';
}

function calendarInitialization(){
	
	const startCalendar = document.querySelector('#start');
	
	let newDate = new Date();
	let dateToday = newDate.getDate();
	let month = newDate.getMonth()+1;
	let year = newDate.getFullYear();
	let theTime = newDate.getHours() + ":" + newDate.getMinutes() + ":" + newDate.getSeconds();

	if (dateToday < 10) {
		dateToday = '0' + dateToday;
	}

	if (month < 10) {
		month = '0' + month;
	}
	
	startCalendar.value = year + '-' + month + '-' + dateToday;
	startCalendar.min = year + '-' + month + '-' + dateToday;

}

function selectCar(e) {
	e.preventDefault();
	
	if(e.target.type == "button"){
		car = e.target.innerText;
		e.target.classList = 'btn btn-success'
		
		const theParent = e.target.parentElement;
		for (let i = 0; i < theParent.children.length; i++) {
			if(theParent.children[i].id != e.target.id && theParent.children[i].type == "button"){
				theParent.children[i].classList = 'btn btn-primary';
			}
		}
		
		
		const theSeatInfo = document.querySelector('#select_seats')
		if(e.target.id == "uberxl"){
			theSeatInfo.innerHTML = '<p>Select total number of seats.</p><button id="one" type="button" class="btn btn-primary">1</button><button id="two" type="button" class="btn btn-primary">2</button><button id="three" type="button" class="btn btn-primary">3</button><button id="four" type="button" class="btn btn-primary">4</button><button id="four" type="button" class="btn btn-primary">5</button>'
		}
		else if(e.target.id == "uberx"){
			theSeatInfo.innerHTML = '<p>Select total number of seats.</p><button id="one" type="button" class="btn btn-primary">1</button><button id="two" type="button" class="btn btn-primary">2</button><button id="three" type="button" class="btn btn-primary">3</button>'

		}
	    else if(e.target.id == "uberpool"){
			theSeatInfo.innerHTML = '<p>Select total number of seats.</p><button id="one" type="button" class="btn btn-primary">1</button>'
		}
		
		
	}
	
}

function initialize() {
      var input = document.getElementById('inputOrigin2');
      var autocomplete = new google.maps.places.Autocomplete(input);

        autocomplete.bindTo('bounds', map);
        autocomplete.setFields(
            ['address_components', 'geometry', 'icon', 'name']);
        google.maps.event.addListener(autocomplete, 'place_changed', function(){
         var place = autocomplete.getPlace();
      })
}

function initializeTwo() {
      var inputTwo = document.getElementById('inputDestination2');
      var autocompleteTwo = new google.maps.places.Autocomplete(inputTwo);
        autocompleteTwo.bindTo('bounds', map);
        autocompleteTwo.setFields(
            ['address_components', 'geometry', 'icon', 'name']);
      google.maps.event.addListener(autocompleteTwo, 'place_changed', function(){
         var placeTwo = autocompleteTwo.getPlace();
      })
}

// Changes book patron information, and calls 
function selectSeats(e) {
	e.preventDefault();

	if(e.target.type == "button"){
		seats = e.target.innerText;
		e.target.classList = 'btn btn-success'
		
		const theParent = e.target.parentElement;
		for (let i = 0; i < theParent.children.length; i++) {
			if(theParent.children[i].id != e.target.id && theParent.children[i].type == "button"){
				theParent.children[i].classList = 'btn btn-primary';
			}
		}
		
	}
	

}

function getCost(){//assuming $0.15 per kilometer
console.log("CARRR" + car)
     if(car === "UberX"){
		 return ((distOriginDest*0.621371)*0.97 + 0.4);
	 }
	 
     if(car === "UberXL"){
		 return ((distOriginDest*0.621371)*1.68 + 2.15);
	 }

     if(car === "Uberpool"){
		 return (((distOriginDest*0.621371)*0.97 + 0.4)*0.4);//around 40 percent of uberx
	 }	 
	 
	 return 0
}


function create(){
	console.log("create entered")
	const errorMsg = document.querySelector('#create_fail');

	let timeElem;
	theDate = document.querySelector('input[type="date"]').value;
	theTime = document.querySelector('input[type="time"]').value;
	
	console.log("THE DATE" + theDate)
	console.log("THE TIME" + theTime)
	
    let isAmisPm = " AM";
    if(theTime.substring(0,2) < 12){
        isAmisPm = " AM";
    } else {
        isAmisPm = " PM";   
    }
    
	hour = +theTime.substr(0, 2);
	theMinute = +theTime.substr(2, 4);
	theSeconds = +theTime.substr(4, 6);
	theHour = (hour % 12)||12;
	
	date = +theDate.substr(0, 2);
	month = +theDate.substr(2, 4);
	year = +theDate.substr(4, 6);
	
	theTime = theHour + theTime.substr(2, 3) + isAmisPm;
	
	

	//var times = new Date();
	//times.getHours();
	//times.getMinutes();

	//if (theTime.substring(0,2) != times.getHours() || theTime.subString(3,5) != times.getMinutes()){
	//	console.log("Error")
	//	console.log(times.getMinutes())
	//	console.log(theTime.substring(3,5))
	//}
	console.log(theTime);
	console.log(theDate);
	
	
	
	if(theDate == "" || typeof theStart === 'undefined' || theStart == "" || theEnd == "" || typeof theEnd === 'undefined' || typeof car === 'undefined' || typeof seats === 'undefined' || typeof theDate === 'undefined' || typeof theTime === 'undefined'){
		errorMsg.style.display = "block";
		scroll(0,0);
		console.log("null vals")
	}
	else{
		errorMsg.style.display = "none";
		//jquery for the modal pop up
		createTicketMethod();
	}
	
}

function viewTheRides(){
	document.location.href = 'view_rides.html';
}

function displayTicket(){
	console.log("ENTERED DISPLAY TICKET")
	const modalContent = document.querySelector('.modal-body');
	const ticketContent = document.createElement('div');
	ticketContent.className = "ticket";
	
	modalContent.innerHTML='<div id="create_success" class="alert alert-success"><strong>Success!</strong> Your ride offer has been shared.</div>';
	
	const ticketHtml = '<div id = "rideInfo"><p><strong>Your Ride Information is as follows:</strong></p><p><strong>Origin: </strong>'+theStart+'</p><p><strong>Destination: </strong>'+theEnd+'</p><p><strong>Uber Type: </strong>'+car+'</p><p><strong>Total Seats: </strong>'+seats+'</p><p><strong>Departure: </strong>'+theDate+' at ' + theTime + '</p></div>';
	
	ticketContent.innerHTML = ticketHtml;
	ticketContent.querySelector('#rideInfo').style.textAlign = 'center';
	ticketContent.querySelector('#rideInfo').style.border = "2px solid green";
	
	modalContent.appendChild(ticketContent);
	
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


function findTheRoute() {
	const theBegin = document.querySelector('#inputOrigin2');
	const theEnd = document.querySelector('#inputDestination2');
    var myReq = {
        origin: theBegin.value,//hard coded for now, replace with values passed from search ride page later after post works
        destination: theEnd.value,
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }

    directionsService.route(myReq, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
			distOriginDest = (result.routes[0].legs[0].distance.value / 1000);
			dtPicker.innerHTML = "<p>Distance to be travelled is " + distOriginDest + " Km and time duration is " + (result.routes[0].legs[0].duration.text) + "</p>";
            directionsDisplay.setDirections(result);
        } else {
            directionsDisplay.setDirections({ routes: [] });
            map.setCenter(theCoord);
			console.log("This address is not correct")
        }
    });
	


}