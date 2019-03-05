/* View rides */


class countdownTimer {
  constructor (hours, minutes, seconds) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }
}

class Ride {
  constructor(type, creator, seatsOccupied, time, date, origin, destination) {
    this.type = type;
    /* user id of the creator of the post */
    this.creator = creator;
    /* object storing userId as key and number of seats as value */
    this.seatsOccupied = seatsOccupied;
    this.time = time;
    this.date = date;
    this.origin = origin;
    this.destination = destination;
    // Distance that the user's location is from this ride's starting point
    // this field will be calculated based on the user and origin/destination
    // parameters
    this.userOriginDistance = parseFloat(Math.random().toFixed(2));
    // Distance that the user's destination is from this ride's destination
    this.userDestDistance = parseFloat(Math.random().toFixed(2));
  }
}

let postNumber = 0;

class Post {
  constructor(ride) {
    this.ride = ride;
    // randomness for phase 1 simulation
    const minutes = Math.floor(Math.random() * 5);
    const seconds = Math.floor(Math.random() * 60);
    this.timer = new countdownTimer(0, minutes, seconds);

    this.seatsAvailable = carType[ride.type] - ride.seatsOccupied;
    this.postNumber = postNumber++;
  }
}

const posts = []
const postArea = document.querySelector('#post-area');

postArea.addEventListener('click', removePostDOM);

/* only applies to own rides */
function removePostDOM(e) {
  const button = e.target.parentElement;
  if (button.classList.contains('close-button')) {
    const postElement = button.parentElement.parentElement.parentElement;
    postArea.removeChild(postElement);
    removePost(parseInt(postElement.id));
  }
}

function removePost(postNumber) {
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].postNumber === postNumber) {
       posts.splice(i, 1);
       return
    }
  }
}

/* Updates all timers on DOM */
function updateTimerDOM() {
  const postElements = document.querySelectorAll('.post');
  for (let i = 0; i < postElements.length; i++) {
    const postElement = postElements[i];
    const postNumber = parseInt(postElement.id);
    const timeContainer = postElement.querySelector('.timer');
    const currentTime = timeContainer.innerText.split(':').map(x => parseInt(x));
    let hours = currentTime[0];
    let minutes = currentTime[1];
    let seconds = currentTime[2];

    seconds -= 1;
    seconds = seconds == -1 ? 59 : seconds; // reset to 59

    minutes = seconds == 59 ? minutes - 1 : minutes;
    minutes = minutes == -1 ? 59 : minutes; // reset to 59

    if (minutes == 59 && seconds == 59) {
      hours -= 1;
    }

    // timer expiry, remove the post
    if (hours == 0 && minutes == 0 && seconds == 0 || hours < 0) {
      postArea.removeChild(postElement);
      removePost(postNumber);
      return
    }

    const hourString = String(hours).padStart(2,'0');
    const minuteString = String(minutes).padStart(2,'0');
    const secondString = String(seconds).padStart(2,'0');
    const timerMarkup = `
      <h4> ${hourString}:${minuteString}:${secondString} </h4>
    `
    timeContainer.innerHTML = timerMarkup;
  }
}

function findPostById() {
  return posts.filter((post) => post.postNumber === id)[0];
}

/* timer functionality */
setInterval(updateTimerDOM, 1000);

/* Get the user that is logged in */
const loggedInUser = getLoggedInUser();

/* UberX/UberPool,  UberXL */
const carType = [4, 6];

/*-------------------- SERVER CALLS ---------------- */

function getLoggedInUser() {
  return getUser(1);
}

/* Server call that retrieves all user information */
function getAllUsers() {
  users = [];
  const user1 = {
    username: 'alex1',
    name: 'Alex Smith',
    phone: '905-383-3929'
  }

  const user2 = {
    username: 'julian1',
    name: 'Julian Edelman',
    phone: '416-291-2012'
  }

  const user3 = {
    username: 'pm1',
    name: 'Peyton Manning',
    phone: '647-392-3292'
  }

  const user4 = {
    username: 'tb12',
    name: 'Tom Brady',
    phone: '215-291-3939'
  }

  users.push(user1);
  users.push(user2);
  users.push(user3);
  users.push(user4);

  return users;
}

/* Server call that retrieves information of users by user id */
function getUser(username) {
  const users = getAllUsers();
  const users_filtered = users.filter((u) => u.username === username);
  return (users_filtered.length === 0) ? -1 : users_filtered[0];
}

/* Server call that retrieves information of all rides currently in
progress */
function getAllRides() {
  /* Server call will be used to get ride */
  const rides = [];
  const ride1 = new Ride(0, 'alex1', {'alex1': 2}, '09:00 PM', '01-03-2020',
        '483 Godric Way, Toronto, ON, M7R485',
        '4853 Baskerville Terrace, Markham, ON, L3RC3C');

  const ride2 = new Ride(1, 'julian1', {'julian1': 1}, '09:14 PM', '01-03-2020',
        'City Centre Bus Terminal, ON, L5U1F8',
        'Union Station, Toronto, ON, M3RC7C');

  const ride3 = new Ride(1, 'pm1', {'pm1': 3}, '09:14 PM', '01-03-2020',
        'City Centre Bus Terminal, ON, L5U1F8',
        'Union Station, Toronto, ON, M3RC7C');

  const ride4 = new Ride(0, 'tb12', {'tb12': 1}, '09:14 PM', '01-03-2020',
        'City Centre Bus Terminal, ON, L5U1F8',
        'Union Station, Toronto, ON, M3RC7C');

  rides.push(ride1);
  rides.push(ride2);
  rides.push(ride3);
  rides.push(ride4);

  return rides;
}

/* ------------------------ END OF SERVER CALLS -------------------- */

/* Create posts of all rides currrently in progress. The rides will
be retrieved by making a server call -- getAllRides() */
function displayAllPosts() {
  const rides = getAllRides();
  for (let i = 0; i < rides.length; i++) {
    createPost(rides[i]);
  }
}

/* Code execution begins here */
displayAllPosts();
/* Code execution ends here */

function createPost(ride) {
  const newPost = new Post(ride);
  // const seatsAvailable = getSeatsAvailable(ride);
  const seatsAvailable = 3;
  const joinedUsers = ride.seatsOccupied;
  const creator = getUser(ride.creator);

  const hourString = String(newPost.timer.hours).padStart(2,'0');
  const minuteString = String(newPost.timer.minutes).padStart(2,'0');
  const secondString = String(newPost.timer.seconds).padStart(2,'0');
  const postMarkup = `
      <div class="card">
      <div class="card-header bg-default">
        <div class="timer">
          <h4> ${hourString}:${minuteString}:${secondString}</h4>
        </div>
        <button type="button" class="close close-button" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="card-body shadow-sm bg-white rounded">
      <div class="post-container row ">
        <div class="col-md-2 img-container">
          <img class="profilePic img-fluid rounded" src="img/profilepic.jpeg">
        </div>
        <div class="col-md-5 text-container">
          <strong> Available Seats </strong>: <span id="seats-available"> ${seatsAvailable}</span> <br>
          <strong> Name:</strong> ${creator.name} <br>
          <strong>Time to call cab: </strong> ${ride.time} <br>
          <strong>Phone Number</strong>: ${creator.phone}
        </div><!--post text container -->
        <div class="col-md-4 third-container">
          </div>
        </div> <!--post container -->
        </div> <!--card-body-->
      </div> <!--card -->
    `
    /* Create new post element */
    const postContainer = document.createElement('div');
    postContainer.classList.add('col-md-10');
    postContainer.classList.add('post');
    postContainer.id = newPost.postNumber;
    postContainer.innerHTML = postMarkup;

    /* Insert into array and DOM */
    posts.push(newPost);
    postArea.appendChild(postContainer);
}
