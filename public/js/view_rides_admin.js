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

  if (op === 'insert') {
    const rideDoc = data.fullDocument;
    const newPost = new Post(rideDoc)
    createPost(newPost);
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

const allPosts = []
const postArea = document.querySelector('#post-area');

window.onload = createAllPosts();

postArea.addEventListener('click', removeRide);

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
      updateRideAJAX();
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

const carType = {
  "UberX": 4,
  "UberXL": 6,
  "UberSELECT": 4,
  "UberBLACK": 4
}

/* Specify current time, just for simulation purposes */
var currentTime = new Date(2020, 0, 3, 20, 55, 52);

/* Remove post from the array */
function removePostById(posts, postNumber) {
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].postNumber === postNumber) {
       posts.splice(i, 1);
       return
    }
  }
}

function removeRide(e) {
  e.preventDefault();
  if (e.target.parentElement.classList.contains('close-button')) {
    const button = e.target.parentElement;

    const postElement = getPostElementFromButton(button);
    console.log(postElement)
    const post = getPostById(allPosts, getPostElementId(postElement));

    removeRideAJAX(post.ride);
  }
}

function getPostElementId(postElement) {
  return parseInt(postElement.id);
}

function getPostById(posts, id) {
  const foundPost = posts.filter((post) => post.postNumber === id);
  return (foundPost.length === 0) ? -1 : foundPost[0];
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

function getPostElementFromButton(button) {
  return button.parentElement.parentElement.parentElement;
}

function getPostMarkup(ride) {
  const seatsAvailable =  carType[ride.carType] - ride.seatsOccupied;

  /* Convert time difference to readable format, sourced from
  https://stackoverflow.com/questions/1322732/convert-seconds-to-hh-mm-ss-with-javascript */
  const timerDifferenceSeconds = (ride.departureTime - new Date()) / 1000;
  const date = new Date(null);
  date.setSeconds(timerDifferenceSeconds); // specify value for SECONDS here
  const timeString = date.toISOString().substr(11, 8).split(':');
  const hourString = timeString[0];
  const minuteString = timeString[1];
  const secondString = timeString[2];

  const expiryTimeString = new Date(ride.departureTime).toLocaleString("en-US").split(', ')[1];

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
          <strong> Name:</strong> ${ride.owner.name} <br>
          <strong>Time to call cab: </strong> ${expiryTimeString} <br>
          <strong>Phone Number</strong>: ${ride.owner.phone}
        </div><!--post text container -->
        <div class="col-md-4 third-container">
          </div>
        </div> <!--post container -->
        </div> <!--card-body-->
      </div> <!--card -->
    `

    return postMarkup;
}

function createPost(newPost) {
  const ride = newPost.ride;

  const postMarkup = getPostMarkup(ride);

  const postContainer = createPostContainer(newPost.postNumber);
  postContainer.innerHTML = postMarkup;

  allPosts.push(newPost);
  postArea.appendChild(postContainer);
}

/* Create new post element with id */
function createPostContainer(id) {
  const postContainer = document.createElement('div');
  postContainer.classList.add('col-md-10');
  postContainer.classList.add('post');
  postContainer.id = id;

  return postContainer;
}

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
      const newPost = new Post(rides[i]);
      createPost(newPost);
    }
    updateEmptyAlerts();
  }).catch((error) => {
      console.log(error)
  })
}

function updateEmptyAlerts() {
  isPostAreaEmpty(postArea) ? $('#alert-empty').show() : $('#alert-empty').hide();
}

function isPostAreaEmpty(postArea) {
  const posts = postArea.getElementsByClassName('post');
  return posts.length === 0;
}
