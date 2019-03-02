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
  }
}

let postNumber = 0;

class Post {
  constructor(ride) {
    this.ride = ride;
    this.timer = new countdownTimer(0, 15, 23);

    this.postNumber = postNumber++;
  }
}

const posts = []

const joinedPostArea = document.querySelector('#joined-post-area');
const otherPostArea = document.querySelector('#other-post-area');

joinedPostArea.addEventListener('click', leaveRide);
otherPostArea.addEventListener('click', joinRide);

function leaveRide(e) {
    if (e.target.classList.contains('btn')) {
      const button = e.target;
      button.classList.remove('btn-danger');
      button.classList.add('btn-success');
      button.innerText = "Join";
      const postElement = button.parentElement.parentElement.parentElement;

      // const post = findPostById(post.id);
      otherPostArea.appendChild(postElement);
    }
}

function joinRide(e) {
  if (e.target.classList.contains('btn')) {
    const button = e.target;
    button.classList.remove('btn-success');
    button.classList.add('btn-danger');
    button.innerText = "Leave";
    const postElement = button.parentElement.parentElement.parentElement;

    // const post = findPostById(post.id);
    joinedPostArea.appendChild(postElement);
  }
}

/* Updates all timers on DOM */
function updateTimerDOM() {
  const postContainers = document.querySelectorAll('.post-container');
  for (let i = 0; i < postContainers.length; i++) {
    const timeContainer = postContainers[i].querySelector('.timer');
    const currentTime = timeContainer.innerText.split(':').map(x => parseInt(x));
    let hours = currentTime[0];
    let minutes = currentTime[1];
    let seconds = currentTime[2];

    seconds -= 1;
    seconds = seconds == -1 ? 59 : seconds; // reset to 59
    minutes = seconds == 59 ? minutes-- : minutes;

    if (minutes == 59 && seconds == 59) {
      hours -= 1;
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

const ride1 = new Ride(0, 2, user, '09:00 PM', '01-03-2020',
      '483 Godric Way, Toronto, ON, M7R485',
      '4853 Baskerville Terrace, Markham, ON, L3RC3C');

const ride2 = new Ride(0, 1, user, '09:14 PM', '01-03-2020',
      'City Centre Bus Terminal, ON, L5U1F8',
      'Union Station, Toronto, ON, M3RC7C');


function createPost(ride) {
  const newPost = new Post(ride);
  // const ride = newPost.ride;
  posts.push(newPost);
  const seatsAvailable = carType[ride.type] - ride.seatsOccupied;

  const hourString = String(newPost.timer.hours).padStart(2,'0');
  const minuteString = String(newPost.timer.minutes).padStart(2,'0');
  const secondString = String(newPost.timer.seconds).padStart(2,'0');
  const postMarkup = `
    <div class="col-md-10 post" id="${newPost.postNumber}">
      <div class="address">
        <h5>${ride.origin}</h5>
      </div>
      <div class="post-container row ">
        <div class="col-md-2 img-container">
          <img class="profilePic img-fluid rounded" src="images/profilepic.jpeg">
        </div>
        <div class="col-md-5 text-container">
          <strong> Available Seats </strong>: ${seatsAvailable} <br>
          <strong> Name:</strong> ${ride.user.name} <br>
          <strong>Time to call cab: </strong> ${ride.time} <br>
          <strong>Distance from origin: </strong>0.2 km<br>
          <strong>Distance from destination: </strong>0.1 km <br>
          <strong>Phone Number</strong>: ${ride.user.phone}
        </div><!--post text container -->
        <div class="col-md-4 third-container">
            <div class="timer">
              <h1> ${hourString}:${minuteString}:${secondString}</h1>
            </div>
            <button class="btn btn-block btn-success btn-join"> Join </button>
        </div>
      </div> <!--post container -->
    </div><!--post -->
    `

    otherPostArea.innerHTML += postMarkup;

}
