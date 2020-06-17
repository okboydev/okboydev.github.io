async function getProvidersLocation() {
  const response = await fetch('https://obduqr52wi.execute-api.us-west-2.amazonaws.com/production/v1/provider/coordenates', {
    mode: 'cors',
    method: 'GET',
    headers: {
      'x-api-key': 'NH4p55Ijpu6ymR6Y0ik0j5N4UrAQIiGaE5JwOS19'
    }
  })
  if(response.status === 200) {
    return response.json()
  }
  return null
}











// The following example creates a marker in Stockholm, Sweden using a DROP
// animation. Clicking on the marker will toggle the animation between a BOUNCE
// animation and no animation.

var marker;

async function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: { lat: 19.432395, lng: -99.133239 }
  });

  const providers = await getProvidersLocation()
  if( providers ) {
    console.log(providers)
  }
  marker = new google.maps.Marker({
    map: map,
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: { lat: 19.4321571, lng: -98.9712076 },
    customInfo: "Cesar"
  });
  marker.addListener('click', toggleBounce);
}

function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}