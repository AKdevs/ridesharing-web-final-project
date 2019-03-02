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
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function() {
			
			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}



// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
//libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));

// Patron 0 loans book 0
//libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
//libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */ 
const locationInfo = document.querySelector('#location_info');
const origin = locationInfo.querySelector('#starting');
const destination = locationInfo.querySelector('#ending');
const createTicket = locationInfo.querySelector('#ticket_info');

const carSelect = document.querySelector('#select_uber');
const seatsSelect = document.querySelector('#select_seats');

let car;
let seats;

/* Event listeners for button submit and button click */

carSelect.addEventListener('click', selectCar);
seatsSelect.addEventListener('click', selectSeats);

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions 
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function selectCar(e) {
	e.preventDefault();
	
	if(e.target.type == "button"){
		car = e.target.id;
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
		seats = e.target.id;
		e.target.classList = 'btn btn-success'
		
		const theParent = e.target.parentElement;
		for (let i = 0; i < theParent.children.length; i++) {
			if(theParent.children[i].id != e.target.id && theParent.children[i].type == "button"){
				theParent.children[i].classList = 'btn btn-primary';
			}
		}
	}
	

}

function createTicket(){
	
	rides.push(new theRides(origin.value, destination.value, car, seats,'01-03-2020','09:00 PM'));
	displayTicket();
}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

function displayTicket(){
	const modalContent = document.querySelector('.modal-body');
	const ticketContent = document,createElement('div');
	ticketContent.className = "ticket";
	const title = document.createElement('h2');
	
	
	
	
}