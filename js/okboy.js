const ENV = 'prod'
const DISCOUNT_FIRST_BUY = 100.0
const FEE = 20.0


const schedule = [
  { value: '09:00:00', text: 'De: 08:00 am a 09:00 am', numeric: 8 },
  { value: '10:00:00', text: 'De: 09:00 am a 10:00 am', numeric: 9 },
  { value: '11:00:00', text: 'De: 10:00 am a 11:00 am', numeric: 10 },
  { value: '12:00:00', text: 'De: 11:00 am a 12:00 pm', numeric: 11 },
  { value: '13:00:00', text: 'De: 12:00 pm a 01:00 pm', numeric: 12 },
  { value: '14:00:00', text: 'De: 01:00 pm a 02:00 pm', numeric: 13 },
  { value: '15:00:00', text: 'De: 02:00 pm a 03:00 pm', numeric: 14 },
  { value: '16:00:00', text: 'De: 03:00 pm a 04:00 pm', numeric: 15 },
  { value: '17:00:00', text: 'De: 04:00 pm a 05:00 pm', numeric: 16 }
]

/**
 * Pupulate schedule
 */
function populateTodaySchedule() {
  // Populate calendar when user select: today
  const currentDate = new Date()
  const hour = currentDate.getHours() + 2
  const datePart = currentDate.toLocaleDateString()
  const date = datePart.split('/')
  var hours = schedule.filter(function (item) {
    return item.numeric >= hour;
  });
  var options = ['<option value=\'\' disabled>Sin horarios disponibles</option>']
  if (hours.length > 0) {
    options = hours.map(item => `<option value=${date[2]}-${date[1].padStart(2, '0')}-${date[0].padStart(2, '0')}T${item.value}>${item.text}</option>`).join('\n')
  }
  const calendar = document.getElementById("timeframe")
  calendar.innerHTML = options
}

/**
 * Populate schedule for next day.
 */
function populateTomorrowSchedule() {
  var currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  const datePart = currentDate.toLocaleDateString()
  const date = datePart.split('/')
  var options = schedule.map(item => `<option value=${date[2]}-${date[1].padStart(2, '0')}-${date[0].padStart(2, '0')}T${item.value}>${item.text}</option>`).join('\n')
  const calendar = document.getElementById("timeframe")
  calendar.innerHTML = options
}

const tomorrow = document.getElementById("manana");
tomorrow.onclick = function () {
  const dayOfService = document.getElementById("dayOfService")
  dayOfService.value = 'Mañana'
  populateTomorrowSchedule()
}

const today = document.getElementById("hoy");
today.onclick = function () {
  const dayOfService = document.getElementById("dayOfService")
  dayOfService.value = 'Hoy'
  populateTodaySchedule()
}

// When select cylinder.
const cylinder = document.getElementById("cylinder");
cylinder.onclick = function () {
  mixpanel.track("Selecciono Cilindro", { "Tipo de Gas": "Cilindro" })
  document.getElementById("serviceTypeLabel").hidden = false
  document.getElementById("nextbutton").textContent = 'Cerrar'
  document.getElementById("nextbutton").onclick = function () { MicroModal.close('createorder') }
}

// When select stationary
const stationary = document.getElementById("stationary");
stationary.onclick = function () {
  document.getElementById("serviceTypeLabel").hidden = true
  document.getElementById("nextbutton").hidden = false
  document.getElementById("nextbutton").textContent = 'Continuar'
  document.getElementById("nextbutton").onclick = function () { toNEXT() }
  toNEXT()
}

const backButton = document.getElementById("backbutton")
backButton.onclick = function () {
  if (step === 1) {
    document.getElementById("nextbutton").textContent = 'Continuar'
    document.getElementById("nextbutton").onclick = function () { toNEXT() }
    toPREV()
  } else {
    toPREV()
  }
}

const amount = document.getElementById("amount")
const amounts = document.getElementById("quantity").querySelectorAll("input")
Array.from(amounts).forEach(card => {
  console.log(card)
  card.onclick = function () {
    if(card.value) {
      amount.value = card.value
    }    
  }
})

amount.onkeyup = function () {
  const rows = document.getElementById("quantity").querySelectorAll("input")
  Array.from(rows).forEach(element => {
    if (element.checked) {
      element.checked = false
    }
  })
}


// When select chash
const cash = document.getElementById("cash");
cash.onclick = function () {
  toNEXT()
}

// When select chash
const terminal = document.getElementById("card");
terminal.onclick = function () {
  toNEXT()
}

// Avanzar cuando completa el teléfono.
const phone = document.getElementById("phone");
phone.onkeyup = function () {
  if (isValidContact()) {
    toNEXT()
  }
}


function getServiceType() {
  const rows = document.getElementById("serviceType").querySelectorAll("input")
  var type = null
  Array.from(rows).forEach(element => {
    if (element.checked) {
      type = element.value
    }
  })
  return type
}


/**
 * Get amount from screen.
 */
function getQuantity() {
  const amount = document.getElementById("amount")
  return new Number(amount.value)
}


/**
 * 
 */

function getSchedule() {
  const dayOfService = document.getElementById("dayOfService")
  const options = document.getElementById("timeframe").querySelectorAll("option")
  var selected = null
  if (options) {
    options.forEach(option => {
      if (option.selected) {
        selected = { day: dayOfService.value, text: option.text, value: option.value }
      }
    })
  }
  return selected
}

/**
 * Get discount by voucher code.
 */
function getDiscountByVoucherCode() {
  var discount = null;
  const field = document.getElementById("cuponCode")
  if (field && field.value) {
    const voucher = vouchers[field.value.toUpperCase()]
    if (voucher) {
      discount = { amount: voucher.amount, symbol: voucher.symbol, code: field.value }
    }
  }
  return discount
}

/**
 * Get contact information from screen.
 */
function getContactInfo() {
  const name = document.getElementById("name").value
  const phone = document.getElementById("phone").value
  return {
    name,
    phone
  }

}

/**
 * Get address from screen
 */
function getAddress() {
  const address = document.getElementById("address")
  const street = document.getElementById("street")
  const sublocality = document.getElementById("sublocality")
  const locality = document.getElementById('locality')
  const state = document.getElementById('state')
  const zipCode = document.getElementById('zipCode')
  const latitude = document.getElementById('latitude')
  const longitude = document.getElementById('longitude')
  const streetNumber = document.getElementById('streetNumber')
  const reference = document.getElementById('reference')
  data = {
    address: address.value,
    street: street.value,
    streetNumber: streetNumber.value,
    sublocality: sublocality.value,
    locality: locality.value,
    state: state.value,
    zipCode: zipCode.value,
    latitude: latitude.value,
    longitude: longitude.value,
    reference: reference.value
  }
  return data
}

/**
 * Get payment type from screen.
 */
function getPaymentType() {
  const rows = document.getElementById("paymentType").querySelectorAll("input")
  var paymentType = ""
  var selected = false
  Array.from(rows).forEach(element => {
    if (element.checked) {
      selected = true
      paymentType = element.value
    }
  })
  if (selected) {
    if (paymentType === 'card') {
      return { type: 2, value: "Con Terminal" }
    }
    return { type: 1, value: "En Efectivo" }
  }
  return null
}

/**
 * Get discount from cupon or discount for first buy.
 */
function calculateDiscount(amount) {
  const voucher = getDiscountByVoucherCode()
  if (voucher) {
    if (voucher.symbol === '$') {
      if (voucher.amount > 0) {
        return { value: voucher.amount, byCupon: true, code: voucher.code }
      }
    }
    if (voucher.symbol === '%') {
      const percentage = voucher.amount / 100
      const discount = amount * percentage
      return { value: discount, byCupon: true, code: voucher.code }
    }
  }

  return { value: DISCOUNT_FIRST_BUY, byCupon: false }
}

/**
 * 
 * @param {*} quantity 
 * @param {*} discount 
 */
function calculateTotalOfService(quantity, discount) {
  return (new Number(quantity) + new Number(FEE)) - new Number(discount.value)
}


/**
 * Show the order summary.
 */
function showOrderSummary() {
  const quantity = getQuantity()
  const contactData = getContactInfo()
  const address = getAddress()
  const paymentType = getPaymentType()
  const discount = calculateDiscount(quantity)
  const total = calculateTotalOfService(quantity, discount)
  const schedule = getSchedule()

  document.getElementById("scheduleValue").textContent = schedule.day + ', ' + schedule.text
  document.getElementById("quantityValue").textContent = "$" + quantity

  if (discount.byCupon) {
    document.getElementById("discountValue").textContent = "$" + discount.value + ", por usar tu cupón: " + discount.code
  } else {
    document.getElementById("discountValue").textContent = "$" + discount.value + ", por primera compra"
  }

  document.getElementById("feeValue").textContent = "$" + FEE
  document.getElementById("totalValue").textContent = "$" + total
  document.getElementById("nameValue").textContent = contactData.name
  document.getElementById("phoneValue").textContent = contactData.phone

  var addressText = ""
  if (address.zipCode) {
    addressText = address.address + ", CP. " + address.zipCode
  } else {
    addressText = address.address
  }
  if (address.reference) {
    addressText = addressText + ". " + address.reference
  }
  document.getElementById("addressValue").textContent = addressText
  document.getElementById("paymentTypeValue").textContent = paymentType.value

  mixpanel.track("Llego al Resumen de Pedido")
}

/**
 * VALIDATORS
 */


function isValidStep(step) {
  var isValidate = true
  switch (step) {
    case 1:
      isValidate = isValidServiceType()
      break;
    case 2:
      isValidate = isValidQuantity()
      break;
    case 3:
      isValidate = isValidContact()
      break;
    case 4:
      isValidate = isValidAddress()
      isValidate = isValidSchedule()
      break;
    case 5:
      isValidate = isValidPaymentMethod()
      break;
    case 6:

      break;
    default:
      break;
  }
  return isValidate
}

function isValidServiceType() {
  const serviceType = getServiceType()
  if (serviceType && serviceType === 'stationary') {
    mixpanel.track("Selecciono Tipo de Gas Estacionario", { "Tipo de Gas": "Estacionario" })
    return true
  }
  return false
}


function isValidPaymentMethod() {
  const paymentType = getPaymentType()
  if (paymentType) {
    mixpanel.track("Selecciono Forma de Pago", { "Forma de Pago": paymentType })
    return true
  }
  return false
}

function isValidSchedule() {
  const schedule = getSchedule()
  if (schedule && schedule.day !== "") {
    mixpanel.track("Selecciono horario valido", { "Horario": schedule })
    return true
  }
  return false
}

function isValidQuantity() {
  const quantity = getQuantity()
  if (quantity >= 400) {
    mixpanel.track("Selecciono Cantidad de Gas", { "Cantidad": quantity })
    return true
  }
  return false
}

function isValidContact() {
  const contactData = getContactInfo()
  if (contactData.name && (contactData.phone && contactData.phone.length >= 10)) {
    mixpanel.track("Lleno Datos de Contacto", { "Nombre": contactData.name, "Telefono": contactData.phone })
    return true
  }
  document.getElementById("name").required = true
  document.getElementById("phone").required = true
  return false
}

function isValidAddress() {
  const address = getAddress()
  if (address.address !== '') {
    mixpanel.track("Selecciono Direccion", { "Dirección": address.address })
    return true
  }
  document.getElementById("address").required = true
  return false
}

/**
 * Validator for telephone input
 * @param {*} textbox 
 * @param {*} inputFilter 
 */
function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
    textbox.addEventListener(event, function () {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      } else {
        this.value = "";
      }
    });
  });
}
setInputFilter(document.getElementById("phone"), function (value) {
  return /^\d*$/.test(value); // Allow digits and '.' only, using a RegExp
});


/**
 * SERVICE BACKEND
 */


function getUrlService() {
  const dev = {
    urlEvents: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/develop/v1/logs',
    urlService: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/develop/v1/services',
    urlSms: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/develop/v1/sms',
    apikey: 'HrwtPKFdr42LrRbRWlHV3alw5iyN3XFo6Ggbm6ry'
  }

  const qa = {
    urlEvents: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/sandbox/v1/logs',
    urlService: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/sandbox/v1services',
    urlSms: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/sandbox/v1/sms',
    apikey: '48FofE5GOB7mw9GL9nvi27rZ7yt2CtKE5ouM7g2A'
  }

  const prod = {
    urlEvents: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/production/v1/logs',
    urlService: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/production/v1/services',
    urlSms: 'https://obduqr52wi.execute-api.us-west-2.amazonaws.com/production/v1/sms',
    apikey: 'NH4p55Ijpu6ymR6Y0ik0j5N4UrAQIiGaE5JwOS19'
  }

  if (ENV === 'dev') {
    return dev
  } else if (ENV === 'qa') {
    return qa
  }
  return prod
}

function registerEvent(key, data) {
  console.log(data)
  const service = getUrlService()
  const body = JSON.stringify({
    key,
    data
  })
  fetch(service.urlEvents, {
    mode: 'cors',
    method: 'POST',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': service.apikey
    }
  }).then(function (response) {
    return response.text();
  })
    .then(function (data) {
      console.log('data = ', data);
    })
    .catch(function (err) {
      console.log('AN ERROR: ', data)
      console.error("ERROR:", err);
    });
}

function makeRequest(data) {
  const service = getUrlService()
  const body = JSON.stringify(data)
  console.log('BODY REQUEST: ', body)
  fetch(service.urlService, {
    mode: 'cors',
    method: 'POST',
    body: body,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': service.apikey
    }
  }).then(function (response) {
    return response.text();
  })
    .then(function (data) {
      console.log('data = ', data);
    })
    .catch(function (err) {
      console.log('AN ERROR: ', data)
      console.error("ERROR:", err);
    });
  sendConfirmationSMS(data.customerData.phoneNumber)


}

/**
 * 
 */
function createServiceOrder() {
  const quantity = getQuantity()
  const discount = calculateDiscount(quantity)
  const contactData = getContactInfo()
  const address = getAddress()
  const paymentType = getPaymentType()
  const schedule = getSchedule()

  data = {
    amount: new Number(quantity * 100),
    fee: new Number(FEE * 100),
    discount: new Number(discount.value * 100),
    serviceDate: schedule.value + '.005Z',
    paymentTypeId: paymentType.type,
    customerData: {
      phoneNumber: contactData.phone,
      deviceType: 'web',
      name: contactData.name,
      address: {
        state: address.state || 'Unknown',
        street: address.street || address.address.substring(0, 50),
        municipality: address.locality || 'Unknown',
        suburb: address.sublocality || 'Unknown',
        numExt: address.streetNumber || 'SN',
        //numInt: '',
        zipcode: address.zipCode || '00000',
        longitude: address.longitude || '00000000000',
        latitude: address.latitude || '00000000000'
      }
    },
    params: window.location.search || ''
  }

  if (address.reference) {
    data.customerData.address.reference = address.reference
  }

  makeRequest(data)

  mixpanel.track("Realizo Pedido", { "Información de Pedido": data })
  dataLayer.push({ 'event': 'realizopedido' })
  // Reg on fb.
  fbq('track', 'CompleteRegistration', data);
  // Reg event
  data.discount = discount
  registerEvent('NEW_SERVICE', data)
}


function sendConfirmationSMS(phoneNumber) {
  console.log("Send sms to client.")
  const service = getUrlService()
  var sms = 'Servicio agendado con éxito, recibirás un WhatsApp de confirmación antes de la hora de tu servicio. Gracias por usar OKBOY.'
  const body = {
    recipient: `+52${phoneNumber}`,
    text: sms,
  }
  if (ENV === 'prod') {
    fetch(service.urlSms, {
      mode: 'cors',
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': service.apikey
      }
    }).then(function (response) {
      console.log(response)
    })
    console.log('Confirmation SMS sent.')
  }
  
}
