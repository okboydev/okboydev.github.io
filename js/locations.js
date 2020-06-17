/**
 * Get the last provider location
 */
async function getProvidersLocation() {
  const response = await fetch('https://obduqr52wi.execute-api.us-west-2.amazonaws.com/production/v1/provider/coordenates', {
    mode: 'cors',
    method: 'GET',
    headers: {
      'x-api-key': 'NH4p55Ijpu6ymR6Y0ik0j5N4UrAQIiGaE5JwOS19'
    }
  })
  if (response.status === 200) {
    return response.json()
  }
  return null
}

/**
 * Get provider detail
 * @param {object} provider 
 */
async function getDataProvider(provider) {
  const response = await fetch(`https://obduqr52wi.execute-api.us-west-2.amazonaws.com/production/v1/admin/providers/${provider.provider_uuid}`, {
    mode: 'cors',
    method: 'GET',
    headers: {
      'x-api-key': 'NH4p55Ijpu6ymR6Y0ik0j5N4UrAQIiGaE5JwOS19'
    }
  })
  if (response.status === 200) {
    return response.json()
  }
  return null
}

/**
 * Get all services
 */
async function getServices() {
  const response = await fetch('https://obduqr52wi.execute-api.us-west-2.amazonaws.com/production/v1/admin/services?page=1&perPage=100&statusId=1&statusId=2&statusId=3&statusId=4', {
    mode: 'cors',
    method: 'GET',
    headers: {
      'x-api-key': 'NH4p55Ijpu6ymR6Y0ik0j5N4UrAQIiGaE5JwOS19'
    }
  })
  if (response.status === 200) {
    return response.json()
  }
  return null
}


async function getDataService(service) {
  const response = await fetch(`https://obduqr52wi.execute-api.us-west-2.amazonaws.com/production/v1/admin/services/${service.registryUuid}`, {
    mode: 'cors',
    method: 'GET',
    headers: {
      'x-api-key': 'NH4p55Ijpu6ymR6Y0ik0j5N4UrAQIiGaE5JwOS19'
    }
  })
  if (response.status === 200) {
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

  await addProvidersToMap(map)
  await addServiceToMap(map)
}

async function addProvidersToMap(map) {
  const providers = await getProvidersLocation()
  if (providers) {
    var icon = {
      url: "assets/pipero.png",
      scaledSize: new google.maps.Size(25, 20),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 0) // anchor
    }
    for (var item = 0; item < providers.length; item++) {
      var provider = providers[item]
      var position = new google.maps.LatLng(provider.latitude, provider.longitude)
      var marker = new google.maps.Marker({
        animation: google.maps.Animation.DROP,
        map: map,
        position: position,
        icon: icon
      })
      google.maps.event.addListener(marker, 'click', (function (marker, provider) {
        return async function () {
          var infowindow = new google.maps.InfoWindow()
          var data = await getDataProvider(provider)
          if (data) {
            const info = '<b>Nombre: </b> ' + data.name + '<br>' +
              '<b>Teléfono: </b>' + data.phoneNumber + '<br>' +
              '<b>Ultima Actualización: </b>' + provider.updated_at
            infowindow.setContent(info)
            infowindow.open(map, marker)
          }
        }
      })(marker, provider))
    }
  }
}


async function addServiceToMap(map) {
  const services = await getServices()
  if (services && services.data) {
    var icon = {
      url: "assets/group.png",
      scaledSize: new google.maps.Size(25, 30),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(0, 0) // anchor
    }

    for (var item = 0; item < services.data.length; item++) {
      var service = services.data[item]
      if (service.request && service.request.customerData && service.request.customerData.address 
          && service.request.customerData.address.latitude && service.request.customerData.address.longitude) {
        const location = {
          latitude: service.request.customerData.address.latitude,
          longitude: service.request.customerData.address.longitude
        }
        var position = new google.maps.LatLng(location.latitude, location.longitude)
        var marker = new google.maps.Marker({
          animation: google.maps.Animation.DROP,
          map: map,
          position: position,
          icon: icon
        })
        google.maps.event.addListener(marker, 'click', (function (marker, service) {
          return async function () {
            var infowindow = new google.maps.InfoWindow()
            var data = await getDataService(service)
            if (data) {
              const info = '<b>Folio: </b> ' + data.folio + '<br>' +
              '<b>Monto: </b>' + data.amount + '<br>' +
              '<b>Fecha y hora del servicio: </b>' + data.serviceDate + '<br>' +
              '<b>Tipo de Pago: </b>' + data.paymentType + '<br>' +
              '<b>Contacto: </b>' + data.phoneNumber + '<br>' +
              '<b>Comisión: </b>' + data.serviceFee + '<br>' +
              '<b>Dirección: </b>' + data.address + '<br>' +
              '<b>Estatus: </b>' + data.status
              infowindow.setContent(info)
              infowindow.open(map, marker)
            }
          }
        })(marker, service))
      }
    }

  }

}



function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}