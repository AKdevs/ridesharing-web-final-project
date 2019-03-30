/* View rides */
class Ride {
  constructor(type, seatsOccupied, user, timer, origin, destination) {
    this.type = type;
    this.seatsOccupied = seatsOccupied;
    this.user = user;
    this.timer = timer;
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
    this.postNumber = postNumber++;
    this.isOwn = 0;
    this.isJoined = 0;
  }
}

const allPosts = [];
var numPassengers = 1;

const joinedPostArea = document.querySelector('#joined-post-area');
const otherPostArea = document.querySelector('#other-post-area');
const ownPostArea = document.querySelector('#own-post-area');
const seatSelector = document.querySelector('#seat-selector');

joinedPostArea.addEventListener('click', leaveRide);
otherPostArea.addEventListener('click', joinRide);
ownPostArea.addEventListener('click', removeOwnPostElement);
// for passenger seat number selection
$('#seat-selector label').on('click', function() {
  numPassengers = parseInt(this.innerText);
});

function disableSeatButtons() {
  const seatButtons = seatSelector.getElementsByTagName('label');
  for (let i = 0; i < seatButtons.length; i++) {
    seatButtons[i].classList.add('Disabled');
  }
}

function enableSeatButtons() {
  const seatButtons = seatSelector.getElementsByTagName('label');
  for (let i = 0; i < seatButtons.length; i++) {
    seatButtons[i].classList.remove('Disabled');
  }
}

function getPostElementFromButton(button) {
  return button.parentElement.parentElement.parentElement.parentElement.parentElement;
}
/* only applies to own rides */
function removeOwnPostElement(e) {
  if (e.target.classList.contains('btn')) {
    const postElement = getPostElementFromButton(e.target);
    ownPostArea.removeChild(postElement);
    removePostById(allPosts, parseInt(postElement.id));
    console.log('yo');

    if (isPostAreaEmpty(ownPostArea)) {
      $('#alert-own').show();
    }
  }
}

function removePostFromPostArea(postArea, postElement) {
  postArea.removeChild(postElement);
}

function isPostAreaEmpty(postArea) {
  const posts = postArea.getElementsByClassName('.post');
  return posts.length === 0;
}

function changePostToNotJoined(post) {
  post.isJoined = 0;
}

function changeButtonFromLeaveToJoin(button) {
  button.classList.remove('btn-danger');
  button.classList.add('btn-success');
  button.innerText = "Join";
}

function changeButtonFromJoinToLeave(button) {
  button.classList.remove('btn-success');
  button.classList.add('btn-danger');
  button.innerText = "Leave";
}

function leaveRide(e) {
    if (e.target.classList.contains('btn')) {
      $('#alert-other').hide();
      const button = e.target;
      changeButtonFromLeaveToJoin(button);

      const postElement = getPostElementFromButton(button);
      const post = getPostById(allPosts, getPostElementId(postElement));

      changePostToNotJoined(post);

      /* show empty alert and enable seat buttons if no rides have been joined */
      displayAlertIfPostAreaEmpty(joinedPostArea);

      updateRideSeatCount(post.ride);
      const newSeatsAvailable = calculateNewSeatsAvailable(post.ride);

      /* Update seat count on DOM */
      updatePostElementSeatCount(postElement, newSeatsAvailable);

      insertPostDOM(otherPostArea, postElement, allPosts);
    }
}
function displayAlertIfPostAreaEmpty(postArea) {
  if (isPostAreaEmpty(postArea)) {
    $('#alert-joined').show();
    enableSeatButtons();
  }
}

function updatePostElementSeatCount(postElement, newSeatsAvailable) {
  postElement.querySelector('#seats-available').innerText = newSeatsAvailable;
}

function updateRideSeatCount(ride) {
  ride.seatsOccupied -= numPassengers;
}

function calculateNewSeatsAvailable(ride) {
  return carType[ride.type] - ride.seatsOccupied;
}

function changePostToJoined(post) {
  post.isJoined = 1;
}

/* Find index of post in sorted array */
function findPostPositionById(posts, postElementId) {
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].postNumber === postElementId) {
      return i;
    }
  }
  return -1;
}

/* Remove post from the array */
function removePostById(posts, postNumber) {
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].postNumber === postNumber) {
       posts.splice(i, 1);
       return
    }
  }
}

/* Get the specific ride, the ride has seats available
seats available - numPassengers = new seats Available
reject the action if
*/
function joinRide(e) {
  if (e.target.classList.contains('btn')) {
    const button = e.target;

    const postElement = getPostElementFromButton(button);
    const post = getPostById(allPosts, getPostElementId(postElement));

    /* get the ride associated with the post, and calculate seats remaining */
    const newSeatsAvailable = calculateNewSeatsAvailable2(post.ride);

    if (newSeatsAvailable < 0) {
      alert('Could not join ride. Not enough available seats.')
      return
    }

    updateSeatCountOnJoin(post.ride);

    changePostToJoined(post);

    disableSeatButtons();

    changeButtonFromJoinToLeave(button);


    /* Update seat count on DOM */
    updatePostElementSeatCount(postElement, newSeatsAvailable);

    insertPostDOM(joinedPostArea, postElement, allPosts);

    $('#alert-joined').hide();
    if (isPostAreaEmpty(otherPostArea)) {
      $('#alert-other').show();
    }
  }
}

function updateSeatCountOnJoin(ride) {
  ride.seatsOccupied += numPassengers;
}
function calculateNewSeatsAvailable2(ride) {
  const seatsAvailable = carType[ride.type] - ride.seatsOccupied;
  return seatsAvailable - numPassengers;
}

function updateTimer(hours, minutes, seconds) {
  seconds -= 1;
  seconds = seconds == -1 ? 59 : seconds; // reset to 59

  minutes = seconds == 59 ? minutes - 1 : minutes;
  minutes = minutes == -1 ? 59 : minutes; // reset to 59

  if (minutes == 59 && seconds == 59) {
    hours -= 1;
  }

  return { 'hours': hours, 'minutes': minutes, 'seconds': seconds }
}

function updateCurrentTime() {
  currentTime = addSeconds(currentTime, 1);
}

/* Updates all timers on DOM */
function updateTimerDOM() {
  const postElements = document.querySelectorAll('.post');
  for (let i = 0; i < postElements.length; i++) {
    const postElement = postElements[i];
    const postNumber = getPostElementId(postElement);

    const timeContainer = postElement.querySelector('.timer');
    const [hours, minutes, seconds] = timeContainer.innerText.split(':').map(x => parseInt(x));
    const timerObj = updateTimer(hours, minutes, seconds);

    if (timerExpired(timerObj)) {
      removePostElement(postElement);
      removePostById(postNumber);
    }
    else {
      timeContainer.innerHTML = generateTimerMarkup(timerObj);
    }
  }
}

function timerExpired(timerObj) {
  return timerObj.hours == 0 && timerObj.minutes == 0 &&
          timerObj.seconds == 0 || timerObj.hours < 0;
}

function removePostElement(postElement) {
  const post = getPostById(allPosts, getPostElementId(postElement));
  if (post.isOwn) {
    removePostFromPostArea(ownPostArea, postElement);
  }
  else if (post.isJoined) {
    removePostFromPostArea(joinedPostArea, postElement);
  }
  else {
    removePostFromPostArea(otherPostArea, postElement);
  }
}

function generateTimerMarkup(timerObj) {
  const hourString = String(timerObj.hours).padStart(2,'0');
  const minuteString = String(timerObj.minutes).padStart(2,'0');
  const secondString = String(timerObj.seconds).padStart(2,'0');
  const timerMarkup = `
    <h1> ${hourString}:${minuteString}:${secondString} </h1>
  `
  return timerMarkup;
}
/* timer functionality */
setInterval(updateTimerDOM, 1000);

/* Get the user that is logged in */
const loggedInUser = getLoggedInUser();

/* Indicates the number of seats
for a specific car type
index 0 = UberX/UberPool
index 1 =  UberXL */
const carType = [4, 6];

/*-------------------- SERVER CALLS ---------------- */

function getLoggedInUser() {
  return getUser(1);
}

/* Server call that retrieves all user information */
function getAllUsers() {
  users = [];
  const user1 = {
    id: 1,
    name: 'Alex Smith',
    phone: '905-383-3929'
  }

  const user2 = {
    id: 2,
    name: 'Julian Edelman',
    phone: '416-291-2012'
  }

  const user3 = {
    id: 3,
    name: 'Peyton Manning',
    phone: '647-392-3292'
  }

  const user4 = {
    id: 4,
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
function getUser(id) {
  const users = getAllUsers();
  const users_filtered = users.filter((u) => u.id === id);
  return (users_filtered.length === 0) ? -1 : users_filtered[0];
}

/* Server call that retrieves information of all rides currently in
progress */
function getAllRides() {
  /* Server call will be used to get ride */
  const rides = [];
  const ride1 = new Ride(0, 2, getUser(1), new Date(2020, 0, 3, 21, 0, 0),
        'City Centre Bus Terminal, ON, L5U1F8',
        'Union Station, Toronto, ON, M1UH83')

  const ride2 = new Ride(1, 3, getUser(2), new Date(2020, 0, 3, 21, 20, 0),
        '483 Godric Way, Mississauga, ON, M7R485',
        '4853 Baskerville Terrace, Markham, ON, L3RC3C');

  const ride3 = new Ride(1, 4, getUser(3), new Date(2020, 0, 3, 21, 15, 0),
        '32 Lowther Street, Mississauga, ON, L5U1F8',
        'Eaton Centre, Toronto, ON, M3RC7C');

  const ride4 = new Ride(0, 1, getUser(4), new Date(2020, 0, 3, 21, 5, 0),
        '382 Falcon Terrace, Mississauga, ON, L5U1F8',
        '82 Front Street, Toronto, ON, M3RC7C');

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

/* Specify current time, just for simulation purposes */
var currentTime = new Date(2020, 0, 3, 20, 55, 52);

/* Code execution begins here */
displayAllPosts();
/* Code execution ends here */

function calculateTimeToExpiry(ride) {
  /* Convert time difference to readable format, sourced from
  https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript */
  const timerDifferenceSeconds = (ride.timer - currentTime) / 1000;
  const date = new Date(null);
  date.setSeconds(timerDifferenceSeconds); // specify value for SECONDS here
  const timeString = date.toISOString().substr(11, 8).split(':');
  const hourString = timeString[0];
  const minuteString = timeString[1];
  const secondString = timeString[2];

  return { 'hourString': hourString, 'minuteString': minuteString, 'secondString': secondString };
}
/* Create new post, add it to the DOM */
function createPost(ride) {
  const newPost = new Post(ride);

  const seatsAvailable = carType[ride.type] - ride.seatsOccupied;

  /* Determine the appropriate area/array where the post should be inserted */
  const postArea = (ride.user.id === loggedInUser.id) ? ownPostArea : otherPostArea;

  if (ride.user.id === loggedInUser.id) {
    newPost.isOwn = 1;
  }

  const { hourString, minuteString, secondString } = calculateTimeToExpiry(ride);

  const expiryTimeString = ride.timer.toLocaleString("en-US").split(', ')[1];

  const postMarkup = `
      <div class="card">
      <div class="card-header bg-default address">
        <div class="address">
          <h5><strong>Starting Point:</strong> ${ride.origin}</h5>
          <h5><strong>Destination:</strong> ${ride.destination}</h5>
        </div>
      </div>
      <div class="card-body shadow-sm bg-white rounded">
      <div class="post-container row ">
        <div class="col-md-2 img-container">
          <img class="profilePic img-fluid rounded" src="img/profilepic.jpeg">
        </div>
        <div class="col-md-5 text-container">
          <strong> Available Seats </strong>: <span id="seats-available"> ${seatsAvailable}</span> <br>
          <strong> Name:</strong> ${ride.user.name} <br>
          <strong>Time to call cab: </strong> ${expiryTimeString} <br>
          <div class="distOrigin">
            <strong>Distance from origin: </strong>${ride.userOriginDistance} km<br>
          </div>
          <div class="distDest">
            <strong>Distance from destination: </strong>${ride.userDestDistance} km <br>
          </div>
          <strong>Phone Number</strong>: ${ride.user.phone}
        </div><!--post text container -->
        <div class="col-md-4 third-container">
            <div class="timer">
              <h1> ${hourString}:${minuteString}:${secondString}</h1>
            </div>
            <button class="btn btn-block btn-success btn-join"> Join </button>
          </div>
        </div> <!--post container -->
        </div> <!--card-body-->
      </div> <!--card -->
    `
    const postContainer = createPostContainer(newPost.postNumber);
    postContainer.innerHTML = postMarkup;

    // change button to "Remove" if post belongs to logged in user
    if (loggedInUser.id === ride.user.id) {
      const button = postContainer.querySelector('.btn-join');
      button.classList.remove('btn-join');
      button.classList.remove('btn-success');
      button.classList.add('btn-danger');
      button.classList.add('btn-remove');
      button.innerText = 'Remove';

      const textContainer = postContainer.getElementsByClassName('text-container')[0];
      textContainer.removeChild(textContainer.querySelector('.distOrigin'));
      textContainer.removeChild(textContainer.querySelector('.distDest'));
    }


    /* Insert into array and DOM */
    insertPost(allPosts, newPost);
    insertPostDOM(postArea, postContainer, allPosts);
}

/* Create new post element with id */
function createPostContainer(id) {
  const postContainer = document.createElement('div');
  postContainer.classList.add('col-md-10');
  postContainer.classList.add('post');
  postContainer.id = id;

  return postContainer;
}
/* Insert post into the array in proper position to
maintain sorted order */
function insertPost(posts, post) {
  posts.push(post);
}

function getPostById(posts, id) {
  const foundPost = posts.filter((post) => post.postNumber === id);

  return (foundPost.length === 0) ? -1 : foundPost[0];
}

function getPostElementId(postElement) {
  return parseInt(postElement.id);
}

function getTotalDistanceFromPostElement(postArray, postElement) {
  const post = getPostById(postArray, getPostElementId(postElement));
  return post.ride.userDestDistance + post.ride.userOriginDistance;
}

/* Insert post into DOM in correct (sorted) position
based on user origin and destination sum */
function insertPostDOM(postArea, postElement, postArray) {
  const postList = postArea.querySelectorAll('.post');

  if (postList.length === 0) {
    postArea.appendChild(postElement);
    return
  }

  let index = 0;

  const distance = getTotalDistanceFromPostElement(postArray, postElement);
  let otherPostDistance = getTotalDistanceFromPostElement(postArray, postList[index]);

  while (distance > otherPostDistance) {
    if (++index >= postList.length) {
      break;
    }
    otherPostDistance = getTotalDistanceFromPostElement(postArray, postList[index]);
  }

  if (index === postList.length) {
    postArea.appendChild(postElement);
  }
  else {
    postArea.insertBefore(postElement, postList[index]);
  }
}
