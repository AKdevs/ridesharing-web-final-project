/* Create Ride - JS */


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

	setLoanTime() {

		const self = this;
		setTimeout(function() {
			
			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}


const locationInfo = document.querySelector('#location_info');
const origin = locationInfo.querySelector('#starting').textContent;
const destination = locationInfo.querySelector('#ending').textContent;

const createRide = locationInfo.querySelector('#ticket_info');

const carSelect = document.querySelector('#select_uber');
const seatsSelect = document.querySelector('#select_seats');
const submitBtn = document.querySelector('#create_button');

let car;
let seats;

/* Event listeners for button submit and button click */

carSelect.addEventListener('click', selectCar);
seatsSelect.addEventListener('click', selectSeats);
submitBtn.addEventListener('click', create);

/*-----------------------------------------------------------*/

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
	}
	
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

function create(e){
	const errorMsg = document.querySelector('#create_fail');
	if(car ==	'' || seats == ''){
		errorMsg.style.display = "block";
	}
	else{
	rides.push(new theRides(origin, ending, car, seats,'01-03-2020','09:00 PM'));
	displayTicket();
	}
}



function displayTicket(){
	const modalContent = document.querySelector('.modal-body');
	const ticketContent = document.createElement('div');
	ticketContent.className = "ticket";
	
	const ticketHtml = '<div id = "rideInfo"><p><strong>Your Ride Information is as follows:</strong></p><p><strong>Origin: </strong>'+origin+'</p><p><strong>Destination: </strong>'+destination+'</p><p><strong>Uber Type: </strong>'+car+'</p><p><strong>Total Seats: </strong>'+seats+'</p><p><strong>Departure: </strong>'+'01-03-2020'+'</p></div>';
	
	ticketContent.innerHTML = ticketHtml;
	ticketContent.querySelector('#rideInfo').style.textAlign = 'center';
	ticketContent.querySelector('#rideInfo').style.border = "2px solid green";
	
	modalContent.appendChild(ticketContent);
	
}