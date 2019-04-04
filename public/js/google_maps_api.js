var directionsService = new google.maps.DirectionsService();

function findDistance(addr1, addr2) {
  var myreq = {
      origin: addr1,
      destination: addr2,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL
  }

  return new Promise((resolve, reject) => {
    directionsService.route(myreq, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
  		    const finalRes = (result.routes[0].legs[0].distance.value / 1000).toString();
          resolve(finalRes);
        }
        else {
          console.log("Could not find address");
          reject(404);
        }
    });
  })
}

// Example
// findDistanceBetweenTwoAddress(addr1, addr2).then((res) => {
//   console.log("Success: " + res);
// }).catch((error) => {
//   console.log(error);
// })
