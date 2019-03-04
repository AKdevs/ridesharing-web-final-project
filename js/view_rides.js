/* View rides */


class countdownTimer {
  constructor (hours, minutes, seconds) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }
}

class Ride {
  constructor(type, seatsOccupied, user, time, date, origin, destination) {
    this.type = 0;
    this.seatsOccupied = seatsOccupied;
    this.user = user;
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
    const minutes = Math.floor(Math.random() * 10);
    const seconds = Math.floor(Math.random() * 60);
    this.timer = new countdownTimer(0, minutes, seconds);

    this.seatsAvailable = carType[ride.type] - ride.seatsOccupied;
    this.postNumber = postNumber++;
  }
}

const joinedPosts = []
const otherPosts = []
var numPassengers = 1;

const joinedPostArea = document.querySelector('#joined-post-area');
const otherPostArea = document.querySelector('#other-post-area');
const seatSelector = document.querySelector('#seat-selector');

joinedPostArea.addEventListener('click', leaveRide);
otherPostArea.addEventListener('click', joinRide);
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

function leaveRide(e) {
    if (e.target.classList.contains('btn')) {
      const button = e.target;
      button.classList.remove('btn-danger');
      button.classList.add('btn-success');
      button.innerText = "Join";

      const postElement = button.parentElement.parentElement.parentElement.parentElement.parentElement;

      /* get index of post in joinedPosts array */
      const postIdx = findPostPositionById(joinedPosts, parseInt(postElement.id));
      const post = joinedPosts[postIdx];

      /* get the ride associated with the post, and calculate seats available */
      const ride = post.ride;
      ride.seatsOccupied -= numPassengers;
      const newSeatsAvailable = carType[ride.type] - ride.seatsOccupied;

      /* insert post into otherPosts array and get index to insert into DOM */
      const idxToInsert = insertPost(otherPosts, joinedPosts[postIdx]);
      joinedPosts.splice(postIdx, 1);

      /* enable seat buttons if no rides have been joined */
      if (joinedPosts.length === 0) {
        enableSeatButtons();
      }

      /* update seat count */
      postElement.querySelector('#seats-available').innerText = newSeatsAvailable;
      insertPostDOM(otherPostArea, postElement, idxToInsert);
    }
}

function findPostPositionById(posts, postElementId) {
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].postNumber === postElementId) {
      return i;
    }
  }
  return -1;
}

function removePost(posts, postNumber) {
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
    const postElement = button.parentElement.parentElement.parentElement.parentElement.parentElement;

    /* get index of post in otherPosts array */
    const postIdx = findPostPositionById(otherPosts, parseInt(postElement.id));

    const post = otherPosts[postIdx];

    /* get the ride associated with the post, and calculate seats remaining */
    const ride = post.ride;
    const seatsAvailable = carType[ride.type] - ride.seatsOccupied;
    const newSeatsAvailable = seatsAvailable - numPassengers;

    if (newSeatsAvailable < 0) {
      alert('Could not join ride. Not enough available seats.')
      return
    }

    ride.seatsOccupied = ride.seatsOccupied + numPassengers;

    /* insert post into joinedPosts array and get index to insert into DOM */
    const idxToInsert = insertPost(joinedPosts, post);

    /* remove the post from the otherPosts array */
    otherPosts.splice(postIdx, 1);

    /* disable all seat buttons */
    disableSeatButtons();
    /* change to leave button */
    button.classList.remove('btn-success');
    button.classList.add('btn-danger');
    button.innerText = "Leave";

    /* update seat count */
    postElement.querySelector('#seats-available').innerText = newSeatsAvailable;

    insertPostDOM(joinedPostArea, postElement, idxToInsert);
  }
}

/* Updates all timers on DOM */
function updateTimerDOM() {
  const postElements = document.querySelectorAll('.post');
  for (let i = 0; i < postElements.length; i++) {
    const timeContainer = postElements[i].querySelector('.timer');
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
      let postIdx = findPostPositionById(otherPosts, parseInt(postElements[i].id));
      if (postIdx == -1) {
        joinedPostArea.removeChild(postElements[i]);
        removePost(joinedPosts, parseInt(postElements[i].id));
        if (joinedPosts.length === 0) {
          enableSeatButtons();
        }
      }
      else {
        otherPostArea.removeChild(postElements[i]);
        removePost(otherPosts, parseInt(postElements[i].id));
        if (otherPosts.length === 0) {
          enableSeatButtons();
        }
      }
      return
    }

    const hourString = String(hours).padStart(2,'0');
    const minuteString = String(minutes).padStart(2,'0');
    const secondString = String(seconds).padStart(2,'0');
    const timerMarkup = `
      <h1> ${hourString}:${minuteString}:${secondString} </h1>
    `
    timeContainer.innerHTML = timerMarkup;
  }
}

/* timer functionality */
setInterval(updateTimerDOM, 1000);

const user = {
  id: 1,
  name: 'John Smith',
  phone: '905-383-3929'
}

/* UberX/UberPool,  UberXL */
const carType = [4, 6]

/* Server call will be used to get ride */
const ride1 = new Ride(0, 2, user, '09:00 PM', '01-03-2020',
      '483 Godric Way, Toronto, ON, M7R485',
      '4853 Baskerville Terrace, Markham, ON, L3RC3C');

const ride2 = new Ride(0, 1, user, '09:14 PM', '01-03-2020',
      'City Centre Bus Terminal, ON, L5U1F8',
      'Union Station, Toronto, ON, M3RC7C');

const ride3 = new Ride(0, 1, user, '09:14 PM', '01-03-2020',
      'City Centre Bus Terminal, ON, L5U1F8',
      'Union Station, Toronto, ON, M3RC7C');

const ride4 = new Ride(0, 1, user, '09:14 PM', '01-03-2020',
      'City Centre Bus Terminal, ON, L5U1F8',
      'Union Station, Toronto, ON, M3RC7C');


createPost(ride1);
createPost(ride2);
createPost(ride3);
createPost(ride4);

function createPost(ride) {
  const newPost = new Post(ride);

  const seatsAvailable = carType[ride.type] - ride.seatsOccupied;

  const hourString = String(newPost.timer.hours).padStart(2,'0');
  const minuteString = String(newPost.timer.minutes).padStart(2,'0');
  const secondString = String(newPost.timer.seconds).padStart(2,'0');
  const postMarkup = `
      <div class="card">
      <div class="card-header bg-default">
        <div class="address">
          <h5>${ride.origin}</h5>
        </div>
      </div>
      <div class="card-body shadow-sm bg-white rounded">
      <div class="post-container row ">
        <div class="col-md-2 img-container">
          <img class="profilePic img-fluid rounded" src="images/profilepic.jpeg">
        </div>
        <div class="col-md-5 text-container">
          <strong> Available Seats </strong>: <span id="seats-available"> ${seatsAvailable}</span> <br>
          <strong> Name:</strong> ${ride.user.name} <br>
          <strong>Time to call cab: </strong> ${ride.time} <br>
          <strong>Distance from origin: </strong>${ride.userOriginDistance} km<br>
          <strong>Distance from destination: </strong>${ride.userDestDistance} km <br>
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
    // otherPostArea.innerHTML += postMarkup;

    /* Create new post element */
    const postContainer = document.createElement('div');
    // postContainer.class = "col-md-10 post";
    postContainer.classList.add('col-md-10');
    postContainer.classList.add('post');

    postContainer.id = newPost.postNumber;
    postContainer.innerHTML = postMarkup;

    const idxToInsert = insertPost(otherPosts, newPost);
    insertPostDOM(otherPostArea, postContainer, idxToInsert);
}

function insertPost(posts, post) {
  if (posts.length == 0) {
    posts.push(post);
    return 0;
  }

  const distanceTotal = post.ride.userOriginDistance + post.ride.userDestDistance;
  let otherDistanceTotal = posts[0].ride.userOriginDistance + posts[0].ride.userDestDistance;
  let idxToInsert;
  let idx = 1;

  while (idx < posts.length && distanceTotal > otherDistanceTotal) {
    otherDistanceTotal = posts[idx].ride.userOriginDistance + posts[idx].ride.userDestDistance;
    idx++;
  }

  if (idx == posts.length && distanceTotal > otherDistanceTotal) {
    idxToInsert = idx;
  }
  else {
    idxToInsert = idx - 1;
  }

  posts.splice(idxToInsert, 0, post);

  return idxToInsert;
}

/* Insert post into posts array in correct (sorted) position
based on user origin and destination sum */
function insertPostDOM(postArea, postElement, idxToInsert) {
  const postList = postArea.querySelectorAll('.post');

  if (postList.length == idxToInsert || postList.length == 0) {
    postArea.appendChild(postElement);
  }
  else {
    postArea.insertBefore(postElement, postList[idxToInsert]);

  }
}
