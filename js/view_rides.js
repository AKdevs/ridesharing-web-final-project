/* View rides */

class countdownTimer {
  constructor (hours, minutes, seconds) {
    this.hours = hours;
    this.minutes = minutes;
    this.seconds = seconds;
  }
}

/* store every timer on the page */
const timerList = []

const timer1 = new countdownTimer(0, 15, 23);
timerList.push(timer1);

function createPost() {

}

function createTimer() {
  const timer = timerList[0];
  const hourString = String(timer.hours).padStart(2,'0');
  const minuteString = String(timer.minutes).padStart(2,'0');
  const secondString = String(timer.seconds).padStart(2,'0');
  const timerMarkup = `
    <h1> ${hourString}:${minuteString}:${secondString} </h1>
  `
  const timeContainers = document.querySelectorAll('.timer');
  timeContainers[0].innerHTML = timerMarkup;
}

/** code execution begins here */
// createTimer();

/* Updates all timers on DOM */
function updateTimer() {
  const timeContainers = document.querySelectorAll('.timer');
  for (let i = 0; i < timeContainers.length; i++) {
    const timer = timerList[i];
    const hourString = String(timer.hours).padStart(2,'0');
    const minuteString = String(timer.minutes).padStart(2,'0');
    const secondString = String(timer.seconds).padStart(2,'0');
    const timerMarkup = `
      <h1> ${hourString}:${minuteString}:${secondString} </h1>
    `
    const timeContainers = document.querySelectorAll('.timer');
    timeContainers[0].innerHTML = timerMarkup;
  }

}

/* timer functionality */
setInterval(function() {
  for (let i = 0; i < timerList.length; i++) {
    timerList[i].seconds -= 1;
    if (timerList[i].seconds == -1) {
      timerList[i].seconds = 59;
    }

    if (timerList[i].seconds == 59) {
      timerList[i].minutes -= 1;
    }

    if (timerList[i].minutes == 59 && timerList[i].seconds == 59) {
      timerList[i].hours -= 1;
    }
  }

  createTimer();
}, 1000);
