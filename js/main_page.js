/* Create Ride - JS */


// global counts

// global arrays

/*-----------------------------------------------------------*/

const findDistTime = document.querySelector('#findDistTime');
const createRideBtn = document.querySelector('#createRideBtn');
const viewRideBtn = document.querySelector('#viewRideBtn');

findDistTime.addEventListener('click',checkInputs);
createRideBtn.addEventListener('click',createRidePage);
viewRideBtn.addEventListener('click',viewRides);


/*-----------------------------------------------------------*/

function checkInputs(e){
	const startingValue = document.querySelector('#inputOrigin').value;
	const endingValue = document.querySelector('#inputDestination').value;
		
	const emptyError = document.querySelector('#create_fail');
	const emptyError1 = document.querySelector('#emptyField1');
	const emptyError2 = document.querySelector('#emptyField2');
	const distTimeInfos = document.querySelector('#distTimeInfo');
	
	
	if(startingValue == '' && endingValue == ''){
		emptyError.style.display = 'block';
		emptyError1.style.display = 'block';
		emptyError2.style.display = 'block';
		distTimeInfos.style.display = 'none';
	}
	else if(startingValue == ''){
		emptyError.style.display = 'block';
		emptyError1.style.display = 'block';
		emptyError2.style.display = 'none';
		distTimeInfos.style.display = 'none';
	}
	else if(endingValue == ''){
		emptyError.style.display = 'block';
		emptyError1.style.display = 'none';
		emptyError2.style.display = 'block';
		distTimeInfos.style.display = 'none';
	}
	else{
		emptyError.style.display = 'none';
		emptyError1.style.display = 'none';
		emptyError2.style.display = 'none';
		distTimeInfos.style.display = 'block';
	}
}

function createRidePage(){
	let input = document.querySelector('#inputOrigin').value;
	let destination = document.querySelector('#inputDestination').value;
	let info = input + '__' + destination;
     url = 'create_ride.html?info=' + encodeURIComponent(info);
	document.location.href = url;
}

function viewRides(){
	document.location.href = 'view_rides.html';
}


/*
function getMap(){
	var theMap ={
		center:new google.maps.LatLng(51.508742, -0.120850),
		zoom:5,
	};
	var actualMap = new google.maps.Map(document.querySelector('googleMaps'),theMap);
}
*/