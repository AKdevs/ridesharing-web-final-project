function getRidesAJAX() {
  const url = '/rides';

  return fetch(url)
  .then((res) => {
      if (res.status === 200) {
         return res.json()
     } else {
          alert('Could not get rides')
     }
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

function getUserAJAX(owner) {
  const url = '/users/search/' + owner;

  return fetch(url)
  .then((res) => {
    if (res.status === 200) {
      return res.json()
    } else {
      alert('Could not find user');
    }
  });
}
