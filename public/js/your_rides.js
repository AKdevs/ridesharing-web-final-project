/* View rides */
class Post {
  constructor(ride) {
    this.ride = ride;
    this.postNumber = Math.floor(Math.random() * 10000);
  }
}

var es = new EventSource('/rides/stream');
es.onmessage = function (event) {
  const data = JSON.parse(event.data);
  const rideId = data.documentKey._id;
  const op = data.operationType;

  const post = findPostByRideId(rideId);
  const owner = post.ride.owner;

  if (owner !== loggedInUser) {
    return
  }

  if (op === 'insert') {
    const rideDoc = data.fullDocument;
    if (rideDoc.owner === loggedInUser) {
      const newPost = new Post(rideDoc)
      createPost(newPost);
    }
  }
  else {
    const post = findPostByRideId(rideId);
    const postElement = findPostElementByPostId(post.postNumber);
    postElement.parentElement.removeChild(postElement);
    removePostById(allPosts, post.postNumber);

    if (op === 'update')  {
      // update op
      const rideDoc = data.fullDocument;
      post.ride = rideDoc;

      createPost(post);
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

const ownPostArea = document.querySelector('#own-post-area');

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
  .then((res) => {
    createAllPosts();
  }).catch((error) => {
    console.log(error)
  })
}

ownPostArea.addEventListener('click', removeRide);

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

/* Remove post from the array */
function removePostById(posts, postNumber) {
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].postNumber === postNumber) {
       posts.splice(i, 1);
       return
    }
  }
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
  isPostAreaEmpty(ownPostArea) ? $('#alert-own').show() : $('#alert-own').hide();
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

/* Specify current time, just for simulation purposes */
var currentTime = new Date(2020, 0, 3, 20, 55, 52);

function calculateTimeToExpiry(ride) {
  /* Convert time difference to readable format, sourced from
  https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript */
  const depTime = new Date(ride.departureTime)
  const timerDifferenceSeconds = (depTime - currentTime) / 1000;
  const date = new Date(null);
  date.setSeconds(timerDifferenceSeconds); // specify value for SECONDS here
  const timeString = date.toISOString().substr(11, 8).split(':');
  const hourString = timeString[0];
  const minuteString = timeString[1];
  const secondString = timeString[2];

  return { 'hourString': hourString, 'minuteString': minuteString, 'secondString': secondString };
}

/* Create new post, add it to the DOM */
function createPost(newPost) {
  const ride = newPost.ride;

  const postArea = ownPostArea;
  const postMarkup = getOwnPostMarkup(ride);

  const postContainer = createPostContainer(newPost.postNumber);
  postContainer.innerHTML = postMarkup;

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

function updateSeatSelector() {
  isPostAreaEmpty(joinedPostArea) ? enableSeatButtons() : disableSeatButtons();
}

/*** AJAX Calls ***/
function createAllPosts() {
  const url = '/rides';
  fetch(url)
  .then((res) => {
      if (res.status === 200) {
         return res.json()
     } else {
          alert('Could not get rides')
     }
  })
  .then((rides) => {
    for (let i = 0; i < rides.length; i++) {
      if (rides[i].owner === loggedInUser) {
        const newPost = new Post(rides[i]);
        createPost(newPost);
      }
    }
    updateEmptyAlerts();
  }).catch((error) => {
      console.log(error)
  })
}

function updateRideAJAX(ride) {
  const url = '/rides/' + ride._id;

  const request = new Request(url, {
      method: 'put',
      body: JSON.stringify(ride),
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
  });

  fetch(request)
  .then((res) => {
      if (res.status === 200) {
         return res.json()
     } else {
          alert('Could not update ride')
     }
  }).catch((error) => {
      console.log(error)
  })
}


function removeRideAJAX(ride) {
  const url = '/rides/' + ride._id;

  const request = new Request(url, {
      method: 'delete',
      body: JSON.stringify(ride),
      headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
      },
  });

  return fetch(request)
  .then((res) => {
      if (res.status === 200) {
         return res.json()
     } else {
          alert('Could not remove ride')
     }
  }).catch((error) => {
      console.log(error)
  })
}

function getOwnPostMarkup(ride) {
  const seatsAvailable = carType[ride.carType] - ride.seatsOccupied;

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
          <strong> Time to call cab: </strong> ${expiryTimeString} <br>
          <strong> Total Distance: </strong><span id='distance'></span> km<br>
        </div><!--post text container -->
        <div class="col-md-4 third-container">
            <div class="timer">
              <h1> ${hourString}:${minuteString}:${secondString}</h1>
            </div>
            <button class="btn btn-block btn-danger btn-remove"> Remove </button>
          </div>
        </div> <!--post container -->
        </div> <!--card-body-->
      </div> <!--card -->
    `
    return postMarkup;
}
