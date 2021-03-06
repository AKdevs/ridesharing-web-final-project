/* View rides */
class Post {
  constructor(ride) {
    this.ride = ride;
    this.postNumber = Math.floor(Math.random() * 10000);
    this.seatsAvailable = 0;
    this.expiryTime = Date(null);
    this.ownerName = "";
    this.ownerPhone = "";
    this.distanceFromOrigin = 0;
    this.distanceFromDest = 0;
  }
}

var es = new EventSource('/rides/stream');
es.onmessage = function (event) {
  const data = JSON.parse(event.data);
  const rideId = data.documentKey._id;
  const op = data.operationType;

  if (op === 'insert') {
    const rideDoc = data.fullDocument;
    if (rideDoc.owner !== loggedInUser) {
      const newPost = new Post(rideDoc)
      createPost(newPost);
    }
  }
  else {
    const post = findPostByRideId(rideId);
    const postElement = findPostElementByPostId(post.postNumber);

    if (op === 'delete') {
      postElement.parentElement.removeChild(postElement);
      removePostById(allPosts, post.postNumber);
    }
    else if (op === 'update')  {
      const rideDoc = data.fullDocument;
      postElement.parentElement.removeChild(postElement);
      post.ride = rideDoc;

      renderPost(post);
    }
  }

  updateEmptyAlerts();
}

function findPostElementByRideId(rideId) {
  const post = findPostByRideId(rideId);
  return findPostElementByPostId(post.postNumber);
}

function findPostByRideId(rideId) {
  const filteredPosts = allPosts.filter((post) => post.ride._id === rideId);

  return filteredPosts[0];
}

function findPostElementByPostId(postId) {
  const postElements = document.querySelectorAll('.post');
  for (let i = 0; i < postElements.length; i++) {
    if (getPostElementId(postElements[i]) === postId) {
      return postElements[i];
    }
  }
}

var allPosts = [];

const userOriginLabel = document.querySelector('#user-origin-info')
const userDestLabel = document.querySelector('#user-dest-info')
const numSeatsLabel = document.querySelector('#num-seats');
const joinedPostArea = document.querySelector('#joined-post-area');
const otherPostArea = document.querySelector('#other-post-area');
const seatSelector = document.querySelector('#seat-selector');

window.onload = function() {
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
  .then((user) => {
    loggedInUser = user.username;
    return loggedInUser;
  })
  .then(() => {
    return getSearchQueryAJAX();
  })
  .then((res) => {
    createAllPosts();
  }).catch((error) => {
    console.log(error)
  })
}

var userOrigin;
var userDest;
var numSeats;

function getSearchQueryAJAX() {
  const url = '/rides/ridesearch/' + loggedInUser;

  return fetch(url)
  .then((res) => {
    if (res.status === 200) {
      return res.json()
    }
    else {
      console.log("Query not found");
    }
  })
  .then((searchQuery) => {
    userOrigin = searchQuery.origin;
    userOriginLabel.innerText = userOrigin;

    userDest = searchQuery.destination;
    userDestLabel.innerText = userDest;

    numSeats = searchQuery.seatsOccupied;
    numSeatsLabel.innerText = numSeats;

    deleteSearchQueryAJAX(searchQuery);
  }).catch((error) => {
    console.log(error)
  })
}

function deleteSearchQueryAJAX(searchQuery) {
  const url = '/rides/ridesearch/' + searchQuery._id;

  const request = new Request(url, {
      method: 'delete',
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(searchQuery)
  });

  fetch(request)
  .then((res) => {
      if (res.status === 200) {
         return res.json()
     } else {
          alert('Could not remove query')
     }
  })
  .then((json) => {
  }).catch((error) => {
      console.log(error)
  })
}

joinedPostArea.addEventListener('click', leaveRide);
otherPostArea.addEventListener('click', joinRide);

function removeRide(e) {
  e.preventDefault();
  if (e.target.classList.contains('btn')) {
    const button = e.target;

    const postElement = getPostElementFromButton(button);
    const post = getPostById(allPosts, getPostElementId(postElement));

    removeRideAJAX(post.ride);
  }
}

function getPostElementFromButton(button) {
  return button.parentElement.parentElement.parentElement.parentElement.parentElement;
}

function removePostFromPostArea(postArea, postElement) {
  postArea.removeChild(postElement);
}

function isPostAreaEmpty(postArea) {
  const posts = postArea.getElementsByClassName('post');
  return posts.length === 0;
}

function leaveRide(e) {
  if (e.target.classList.contains('btn')) {
    const button = e.target;

    const postElement = getPostElementFromButton(button);
    const post = getPostById(allPosts, getPostElementId(postElement));

    post.ride.seatsOccupied -= numSeats;
    post.ride.members = post.ride.members.filter((member) => {
      member !== loggedInUser
    });

    updateRideAJAX(post.ride);
  }
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

function joinRide(e) {
  if (e.target.classList.contains('btn')) {
    const button = e.target;

    const postElement = getPostElementFromButton(button);
    const post = getPostById(allPosts, getPostElementId(postElement));

    /* Calculate seats remaining */
    const newSeatsAvailable = calculateNewSeatsAvailable2(post.ride);

    if (newSeatsAvailable < 0) {
      alert('Could not join ride. Not enough available seats.')
      return
    }

    // update ride
    post.ride.seatsOccupied += numSeats;
    post.ride.members.push(loggedInUser);

    updateRideAJAX(post.ride);
  }
}

function updateSeatCountOnJoin(ride) {
  ride.seatsOccupied += numSeats;
}
function calculateNewSeatsAvailable2(ride) {
  const seatsAvailable = carType[ride.carType] - ride.seatsOccupied;
  return seatsAvailable - numSeats;
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


/* Updates all timers on DOM */
function updateTimerDOM() {
  const postElements = document.querySelectorAll('.post');
  for (let i = 0; i < postElements.length; i++) {
    const postElement = postElements[i];
    const post = getPostById(allPosts, getPostElementId(postElement));

    const timeContainer = postElement.querySelector('.timer');
    const [hours, minutes, seconds] = timeContainer.innerText.split(':').map(x => parseInt(x));
    const timerObj = updateTimer(hours, minutes, seconds);

    if (timerExpired(timerObj)) {
      removeRideAJAX(post.ride)
    }
    else {
      timeContainer.innerHTML = generateTimerMarkup(timerObj);
    }
  }
}

function updateEmptyAlerts() {
  isPostAreaEmpty(joinedPostArea) ? $('#alert-joined').show() : $('#alert-joined').hide();
  isPostAreaEmpty(otherPostArea) ? $('#alert-other').show() : $('#alert-other').hide();
}

function timerExpired(timerObj) {
  return timerObj.hours == 0 && timerObj.minutes == 0 &&
          timerObj.seconds == 0 || timerObj.hours < 0;
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
var loggedInUser;

const carType = {
  "UberX": 4,
  "UberXL": 6,
  "UberSELECT": 4,
  "UberBLACK": 4
}

function calculateTimeToExpiry(ride) {
  /* Convert time difference to readable format, sourced from
  https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript */
  const depTime = new Date(ride.departureTime)
  const timerDifferenceSeconds = (depTime - new Date()) / 1000;
  const date = new Date(null);
  date.setSeconds(timerDifferenceSeconds); // specify value for SECONDS here
  const timeString = date.toISOString().substr(11, 8).split(':');
  const hourString = timeString[0];
  const minuteString = timeString[1];
  const secondString = timeString[2];

  return { 'hourString': hourString, 'minuteString': minuteString, 'secondString': secondString };
}


function renderPost(post) {
  const ride = post.ride;
  let postArea;
  let postMarkup;

  if (ride.members.includes(loggedInUser)) {
    postArea = joinedPostArea;
    postMarkup = getJoinedPostMarkup(ride);
  }
  else {
    postArea = otherPostArea;
    postMarkup = getOtherPostMarkup(ride);
  }

  const postContainer = createPostContainer(post.postNumber);
  postContainer.innerHTML = postMarkup;

  postContainer.querySelector('#name').innerText = post.ownerName;
  postContainer.querySelector('#phone').innerText = post.ownerPhone;

  postContainer.querySelector('#distanceFromOrigin').innerText = post.distanceFromOrigin;
  postContainer.querySelector('#distanceFromDest').innerText = post.distanceFromDest;

  insertPostDOM(postArea, postContainer, allPosts);
  updateEmptyAlerts()
}

/* Create new post, add it to the DOM */
function createPost(post) {
  const ride = post.ride;

  let postArea;
  let postMarkup;

  if (ride.members.includes(loggedInUser)) {
    postArea = joinedPostArea;
    postMarkup = getJoinedPostMarkup(ride);
  }
  else {
    postArea = otherPostArea;
    postMarkup = getOtherPostMarkup(ride);
  }

  const postContainer = createPostContainer(post.postNumber);
  postContainer.innerHTML = postMarkup;

  getUserAJAX(ride.owner)
  .then((user) => {
    post.ownerName = user.firstname + " " + user.lastname;
    post.ownerPhone = user.phone;

    postContainer.querySelector('#name').innerText = post.ownerName;
    postContainer.querySelector('#phone').innerText = post.ownerPhone;

    return findDistance(userOrigin, ride.origin);
  })
  .then((distanceFromOrigin) => {
    post.distanceFromOrigin = distanceFromOrigin;
    postContainer.querySelector('#distanceFromOrigin').innerText = post.distanceFromOrigin;
    return findDistance(userDest, ride.destination);
  })
  .then((distanceFromDest) => {
    post.distanceFromDest = distanceFromDest
    postContainer.querySelector('#distanceFromDest').innerText = post.distanceFromDest;
  }).catch((error) => {
    console.log(error);
  })
  insertPost(allPosts, post);
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
  return post.distanceFromDest + post.distanceFromOrigin;
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

/*** AJAX Calls ***/
function createAllPosts() {
  getRidesAJAX()
  .then((rides) => {
    for (let i = 0; i < rides.length; i++) {
      if (rides[i].owner !== loggedInUser) {
        const newPost = new Post(rides[i]);
        createPost(newPost);
      }
    }
    updateEmptyAlerts();
  }).catch((error) => {
      console.log(error)
  })
}

function getJoinedPostMarkup(ride) {
  const seatsAvailable = carType[ride.carType] - ride.seatsOccupied;
  const splitcost = (ride.cost / ride.seatsOccupied).toFixed(2);

  const { hourString, minuteString, secondString } = calculateTimeToExpiry(ride);

  const expiryTimeString = new Date(ride.departureTime).toLocaleString("en-US").split(', ')[1];
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
          <img class="profilePic img-fluid rounded" src="/profilepic.jpeg">
        </div>
        <div class="col-md-5 text-container">
          <strong> Available Seats </strong>: <span id="seats-available"> ${seatsAvailable}</span> <br>
          <strong> Cost Per Person </strong>: <span id="cost">$ ${splitcost}</span> <br>
          <strong> Name: </strong> <span id="name"></span><br>
          <strong>Phone Number</strong>: <span id='phone'></span><br>
          <strong> Time to call cab: </strong> ${expiryTimeString} <br>
          <strong>Distance from origin: </strong><span id='distanceFromOrigin'></span> km<br>
          <strong>Distance from destination: </strong><span id='distanceFromDest'></span> km<br>
        </div><!--post text container -->
        <div class="col-md-4 third-container">
            <div class="timer">
              <h1> ${hourString}:${minuteString}:${secondString}</h1>
            </div>
            <button class="btn btn-block btn-danger btn-leave"> Leave </button>
          </div>
        </div> <!--post container -->
        </div> <!--card-body-->
      </div> <!--card -->
    `
    return postMarkup;
}

function getOtherPostMarkup(ride) {
  const seatsAvailable = carType[ride.carType] - ride.seatsOccupied;
  const splitcost = (ride.cost / ride.seatsOccupied).toFixed(2);

  const { hourString, minuteString, secondString } = calculateTimeToExpiry(ride);

  const expiryTimeString = new Date(ride.departureTime).toLocaleString("en-US").split(', ')[1];
  const postMarkup = `
      <div class="card">
      <div class="card-header bg-default address">
        <div class="address">
          <h5><strong>Starting Point:</strong > ${ride.origin}</h5>
          <h5><strong>Destination:</strong> ${ride.destination}</h5>
        </div>
      </div>
      <div class="card-body shadow-sm bg-white rounded">
      <div class="post-container row ">
        <div class="col-md-2 img-container">
          <img class="profilePic img-fluid rounded" src="/profilepic.jpeg">
        </div>
        <div class="col-md-5 text-container">
          <strong> Available Seats </strong>: <span id="seats-available"> ${seatsAvailable}</span> <br>
          <strong> Cost Per Person </strong>: $<span id="cost"> ${splitcost}</span> <br>
          <strong> Name: </strong> <span id="name"></span><br>
          <strong>Phone Number</strong>: <span id='phone'></span><br>
          <strong> Time to call cab: </strong> ${expiryTimeString} <br>
          <strong>Distance from origin: </strong><span id='distanceFromOrigin'></span> km<br>
          <strong>Distance from destination: </strong><span id='distanceFromDest'></span> km<br>
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
    return postMarkup;
}
